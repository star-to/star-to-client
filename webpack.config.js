const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

const pathOutput = path.resolve(__dirname, "dist/public/js");
const pathTs = path.resolve(__dirname, "src/ts");
const pathScss = path.resolve(__dirname, "src/scss");

module.exports = {
  entry: [pathTs + "/index.ts", pathScss + "/style.scss"],
  output: {
    path: pathOutput,
    filename: "star-to.bundle.js",
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "../css/style.css" }),
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
      inject: false,
      filename: "../../index.html",
      favicon: "./src/assets/icon/favicon.ico",
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
      {
        test: /\.svg$/i,
        use: "raw-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@component": path.resolve(__dirname, "src/ts/component"),
    },
  },
  devtool: "source-map",
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    proxy: {
      "/api": {
        target: "http://localhost:7070",
      },
    },
  },
};
