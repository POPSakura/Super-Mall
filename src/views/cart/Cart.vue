<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <template #center>
        购物车({{cartCount}})
      </template>
    </nav-bar>
    <cart-list class="cart-list" />
    <bottom-bar />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import BottomBar from './childComps/BottomBar'
import { mapGetters } from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    BottomBar
  },
  computed: {
    // cartCount() {
    //   return this.$store.getters.cartLength
    // }
    ...mapGetters({
      cartCount: 'cartLength'
    })
  }
}
</script>

<style scoped>
#cart {
  /*position: relative;*/
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
  z-index: 999;
}
.cart-list {
  position: absolute;
  top: 44px;
  bottom: 93px;
  width: 100%;
  overflow: hidden;
}
</style>
