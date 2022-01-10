const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

const pathOutput = path.resolve(__dirname, "dist/public/js");
const pathTs = path.resolve(__dirname, "client/ts");
const pathScss = path.resolve(__dirname, "client/scss");

module.exports = {
  entry: [pathTs + "/index.ts", pathScss + "/style.scss"],
  output: {
    path: pathOutput,
    filename: "star-to.bundle.js",
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "../css/style.css" }),
    new HtmlWebpackPlugin({
      template: "./client/html/index.html",
      inject: false,
      filename: "../../index.html",
    }),
    new WebpackShellPluginNext({
      onAfterDone: {
        scripts: ["bash script.sh"],
        blocking: false,
        parallel: false,
        logging: false,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "source-map",
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    // https: {
    //   key: "./localhost+1-key.pem",
    //   cert: "./localhost+1.pem",
    //   requestCert: true,
    // },
    compress: true,
    port: 9000,
    proxy: {
      "/api": {
        target: "http://localhost:7070",
<<<<<<< HEAD
        // pathRewrite: { "^/api": "" },
        // secure: false,
        // logLevel: "debug",
=======
>>>>>>> settings/webpack
      },
    },
  },
};
