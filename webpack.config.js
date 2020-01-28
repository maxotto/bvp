/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + "/src/index.html",
  filename: "index.html",
  inject: "body"
});
const VueLoaderPlugin = require("vue-loader/lib/plugin");

//PWA
const WorkboxPlugin = require("workbox-webpack-plugin");

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
  entry: {
    main: "./src/index.ts"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name]_[contenthash].bundle.js"
    // chunkFilename: "[name].chunk.js"
  },
  // got from here https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          }
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: "file-loader?name=fonts/[name].[ext]!static"
      },
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
    new CopyPlugin([{ from: "static", to: "" }]),
    new VueLoaderPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
};
