// vue.config.js
module.exports = {
  css: {
    // if you need css sourceMap, uncomment
    //  sourceMap: true,
    extract: {
      filename: 'css/[name].css?_hash=[contenthash:8]',
      chunkFilename: 'css/[name].css?_hash=[contenthash:8]'
    }
  },
  filenameHashing: false,
  configureWebpack: {
    output: {
      filename: 'js/[name].[hash].js',
      chunkFilename: 'js/[chunkhash].chunk.js'
    },
    optimization: {
      splitChunks: false
    }
  }
}
