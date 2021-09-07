/* Configure HTMLWebpack plugin */
// Import all app configs
const appConfig = require("./build/app.js");
const appConfigDev = require("./build/dev.js");
const appConfigProduction = require("./build/prod.js");
const argv = require("yargs").argv;
const _ = require("lodash");
const ENV = argv.env || "dev";
const settings = composeConfig(ENV);
settings.env = ENV;
console.log("WEBPACK started with this settings:", settings);

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
const plugins = [
  HTMLWebpackPluginConfig,
  BrowserSyncPluginConfig,
  ProgressBarPluginConfig,
  new CopyPlugin({
    patterns:[
      { from: "assets", to: "assets" },
      { from: "fonts", to: "fonts" },
      { from: "static", to: "" }
    ]
  }),
  new VueLoaderPlugin()
  /*
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
     */
];
if (ENV === "prod") {
  //PWA
  const WorkboxPlugin = require("workbox-webpack-plugin");
  plugins.push(
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  );
}

/* Export configuration */
module.exports = {
  mode: settings.mode,
  devtool: settings.devtool,
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
    minimize: true,
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
          {
            loader: "css-loader"
          }
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
            options: {}
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
    },
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/")
    }
  },
  plugins: plugins
};

function composeConfig(env) {
  if (env === "dev") {
    return _.merge({}, appConfig, appConfigDev);
  }

  if (env === "prod") {
    return _.merge({}, appConfig, appConfigProduction);
  }
}
