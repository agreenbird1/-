const path = require('path')

module.exports = {
  pluginOptions: {
    // less共享样式、变量
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些文件需要自动注入
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less')
      ]
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    },
    // 忽略import关于qc的引入文件资源的打包
    externals: {
      qc: 'QC'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
    // 开启ip访问地址权限
    config.devServer.disableHostCheck(true)
  },
  // 基本路径   整个文件夹在哪
  publicPath: './',
  // 输出文件目录   文件夹名
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。    资源放的目录
  assetsDir: './static',
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径    index的路劲和名字
  indexPath: './index.html',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  parallel: require('os').cpus().length > 1 // 构建时开启多进程处理babel编译
}
