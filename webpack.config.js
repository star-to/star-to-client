const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./client/ts/index.ts", "./client/scss/style.scss"],
  output: {
    path: path.resolve(__dirname, "client/dist/js"),
    filename: "star-to.bundle.js",
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "../css/style.css" }),
    // new HtmlWebpackPlugin({
    //   template: "./client/html/index.html",
    //   filename: "index.html",
    // }),
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
  devtool: "source-map",
  mode: "development",
};
