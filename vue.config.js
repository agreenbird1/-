const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些文件需要自动注入
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less')
      ]
    }
  }
}
