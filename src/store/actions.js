import { ADD_COUNTER, ADD_TO_CART } from './mutation-types'

export default {
  addCart({ state, commit } , payload) {
    return new Promise((resolve, reject) => {
      const product = state.cartList.find(item => item.iid === payload.iid)
      if (product){
        commit(ADD_COUNTER, product)
        resolve('当前商品数量+1')
      } else {
        payload.count = 1
        payload.checked = false
        commit(ADD_TO_CART, payload)
        resolve('添加购物车成功')
      }
    })
  }
}