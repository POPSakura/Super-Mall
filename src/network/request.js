import axios from 'axios'

export function request(config) {
  // 1. 创建 axios 实例
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000/api/hy',
    // timeout: 5000
  })

  // 2.配置 axios 拦截器
  instance.interceptors.request.use(config => {
    return config
  }, error => {
    console.log(error)
  })

  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    console.log(error)
  })

  // 3.发送网络请求
  return instance(config)
}

//export { request }