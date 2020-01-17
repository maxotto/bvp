/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + "/src/index.html",
  filename: "index.html",
  inject: "body"
});
const VueLoaderPlugin = require("vue-loader/lib/plugin");

/* Configure BrowserSync */
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const BrowserSyncPluginConfig = new BrowserSyncPlugin(
  {
    host: "localhost",
    port: 3000,
    proxy: "http://localhost:8080/"
  },
  (config = {
    reload: false
  })
);

/* Configure ProgressBar */
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const ProgressBarPluginConfig = new ProgressBarPlugin();

/* Export configuration */
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: ["./src/index.ts"],
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js"
    // chunkFilename: "[name].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        exclude: /[\/\\]src[\/\\]/,
        use: [
          {
            loader: "style-loader",
            options: { injectType: "singletonStyleTag" }
          },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.css$/,
        exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
        use: [
          {
            loader: "style-loader",
            options: { injectType: "singletonStyleTag" }
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "local",
                localIdentName: "[local]",
                hashPrefix: "my-custom-hash"
              }
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  resolve: {
    extensions: [".web.ts", ".web.js", ".ts", ".js", ".vue"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },
  plugins: [
    HTMLWebpackPluginConfig,
    BrowserSyncPluginConfig,
    ProgressBarPluginConfig,
    new CopyPlugin([{ from: "assets", to: "assets" }]),
    new CopyPlugin([{ from: "fonts", to: "fonts" }]),
    new VueLoaderPlugin()
  ]
};
