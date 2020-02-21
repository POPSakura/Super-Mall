<template>
  <tab-bar>
    <tab-bar-item link="/home">
      <template #icon>
        <img src="~assets/img/tabbar/home.svg" alt="">
      </template>
      <template #active-icon>
        <img src="~assets/img/tabbar/home_active.svg" alt="">
      </template>
      <template #text>
        <div>首页</div>
      </template>
    </tab-bar-item>
    <tab-bar-item link="/category">
      <template #icon>
        <img src="~assets/img/tabbar/category.svg" alt="">
      </template>
      <template #active-icon>
        <img src="~assets/img/tabbar/category_active.svg" alt="">
      </template>
      <template #text>
        <div>分类</div>
      </template>
    </tab-bar-item>
    <tab-bar-item link="/cart">
      <template #icon>
        <img src="~assets/img/tabbar/cart.svg" alt="">
      </template>
      <template #active-icon>
        <img src="~assets/img/tabbar/cart_active.svg" alt="">
      </template>
      <template #text>
        <div>购物车</div>
      </template>
    </tab-bar-item>
    <tab-bar-item link="/profile">
      <template #icon>
        <img src="~assets/img/tabbar/profile.svg" alt="">
      </template>
      <template #active-icon>
        <img src="~assets/img/tabbar/profile_active.svg" alt="">
      </template>
      <template #text>
        <div>我的</div>
      </template>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
import TabBar from 'components/common/tabbar/TabBar'
import TabBarItem from 'components/common/tabbar/TabBarItem'
export default {
  name: 'MainTabBar',
  components: {
    TabBar,
    TabBarItem
  }
}
</script>

<style scoped>
  
</style>