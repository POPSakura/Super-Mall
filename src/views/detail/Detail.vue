<template>
  <div id="detail">
    <detail-nav-bar 
      @titleClick="titleClick" 
      :current-index="currentIndex"
      ref="nav"
      class="detail-nav">
    </detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :data="[topImages, goods, shop, detailInfo, paramInfo, commentInfo, recommendList]"
      :probe-type="3"
    >
      <div>
        <detail-swiper ref="base" :top-images="topImages" />
        <detail-base-info :goods="goods" />
        <detail-shop-info :shop="shop" />
        <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad" />
        <detail-param-info ref="param" :param-info="paramInfo" />
        <detail-comment-info ref="comment" :comment-info="commentInfo" />
        <detail-recommend-info ref="recommend" :recommend-list="recommendList" />
      </div>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backTop" class="back-top" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailRecommendInfo from './childComps/DetailRecommendInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam
} from 'network/detail'
import { itemListenerMixin, backTopMixin } from 'common/mixin'
import { BACKTOP_DISTANCE } from 'common/const'
import { debounce } from 'common/utils'
import { mapActions } from 'vuex'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailRecommendInfo,
    DetailBottomBar,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: "",
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendList: [],
      themeTops: [],
      currentIndex: 0,
      getThemeTopY: null
    }
  },
  methods: {
    detailImageLoad() {
      this.refresh()
      this.getThemeTopY()
      // this.$refs.scroll.refresh()
    },
    getOffsetTops() {
      this.themeTops = []
      this.themeTops.push(this.$refs.base.$el.offsetTop)
      this.themeTops.push(this.$refs.param.$el.offsetTop)
      this.themeTops.push(this.$refs.comment.$el.offsetTop)
      this.themeTops.push(this.$refs.recommend.$el.offsetTop)
      this.themeTops.push(Number.MAX_VALUE)
    },
    contentScroll(position) {
      // 1.监听backTop的显示
      this.isShowBackTop = Math.abs(position.y) > BACKTOP_DISTANCE
      // 2.监听滚动到哪一个主题
      this.listenScrollTheme(-position.y)
    },
    listenScrollTheme(position) {
      let length = this.themeTops.length
      for (let i = 0; i < length; i++) {
        let iPos = this.themeTops[i]
        if (position >= iPos && position < this.themeTops[i + 1]) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
          break
        }
      }
    },
    titleClick(index) {
      console.log(this.themeTops[index])
      this.$refs.scroll.scrollTo(0, -this.themeTops[index], 500)
    },
    ...mapActions([
      'addCart'
    ]),
    addToCart() {
      // 1.创建对象
      const product = {}
      // 2.对象信息
      product.iid = this.iid
      product.imgURL = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.newPrice = this.goods.nowPrice
      // 3.添加到Store中
      this.addCart(product).then((message) => {
        this.$toast.show(message)
      })
    },
    getDetailData() {
      this.iid = this.$route.query.iid
      getDetail(this.iid).then(({ result }) => {
        // 顶部信息
        this.topImages = result.itemInfo.topImages
        // 商品基本信息
        this.goods = new Goods(
          result.itemInfo,
          result.columns,
          result.shopInfo.services
        )
        // 店铺信息
        this.shop = new Shop(result.shopInfo)
        // 商品详细信息
        this.detailInfo = result.detailInfo
        // 参数信息
        this.paramInfo = new GoodsParam(
          result.itemParams.info,
          result.itemParams.rule
        )
        // 评论信息
        if (result.rate.cRate !== 0) {
          this.commentInfo = result.rate.list[0]
        }
      })
    },
    getRecommend() {
      getRecommend().then((res, error) => {
        if (error) return
        this.recommendList = res.data.list
      })
    }
  },
  created() {
    this.getDetailData()
    this.getRecommend()
    this.getThemeTopY = debounce(() => {
      this.getOffsetTops()
    }, 100)
  },
  updated() {
    // 获取需要的四个offsetTop
    // this.getOffsetTops()
  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListnner)
  }
}
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 1;
  background-color: #ffffff;
}
.detail-nav {
  position: relative;
  background-color: #ffffff;
  z-index: 999;
}
.content {
  height: calc(100% - 44px - 49px);
}
.back-top {
  position: fixed;
  right: 10px;
  bottom: 65px;
}
</style>
