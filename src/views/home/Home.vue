<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template #center>购物街</template>
    </nav-bar>
    <tab-control 
      :titles="['流行', '新款', '精选']"
      @itemClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabShow">
    </tab-control>
    <scroll 
      class="content" 
      ref="scroll" 
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control 
        :titles="['流行', '新款', '精选']"
        @itemClick="tabClick"
        ref="tabControl2">
      </tab-control>
      <goods-list :goods-list="showGoodsList"></goods-list>
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import { itemListenerMixin, backTopMixin } from "common/mixin"
import { getHomeMultidata, getHomeData, BANNER, RECOMMEND } from 'network/home'
import { NEW, POP, SELL, BACKTOP_DISTANCE } from "common/const"

export default {
  name: 'Home',
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goodsList: {
        'pop': { page: 1, list: [] },
        'new': { page: 1, list: [] },
        'sell': { page: 1, list: [] }
      },
      currentType: POP,
      tabOffsetTop: 0,
      isTabShow: false,
      saveY: 0
    }
  },
  components: {
    NavBar,
    Scroll,
    TabControl,
    GoodsList,
    HomeSwiper,
    RecommendView,
    FeatureView
  },
  computed: {
    showGoodsList() {
      return this.goodsList[this.currentType].list
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    contentScroll(position) {
      this.isShowBackTop = Math.abs(position.y) > BACKTOP_DISTANCE
      this.isTabShow = Math.abs(position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    getMultiData() {
      getHomeMultidata().then(res => {
        this.banners = res.data[BANNER].list
        this.recommends = res.data[RECOMMEND].list
      })
    },
    getHomeGoods(type) {
      getHomeData(type, this.goodsList[type].page).then(res => {
        const goodsList = res.data.list;
        this.goodsList[type].list.push(...goodsList)
        this.goodsList[type].page += 1
        this.$refs.scroll.finishPullUp()
      })
    }
  },
  created() {
    this.getMultiData()
    this.getHomeGoods(POP)
    this.getHomeGoods(NEW)
    this.getHomeGoods(SELL)
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
#home {
  height: 100vh;
  padding-top: 44px;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #ffffff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  z-index: 999;
}
/* #home {
  height: 100vh;
}
.content {
  margin-top: 44px;
  height: calc(100% - 93px);
  overflow: hidden;
} */
</style>