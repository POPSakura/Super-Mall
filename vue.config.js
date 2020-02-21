const path = require('path')

module.exports = {
  configureWebpack: {
    devServer: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
}