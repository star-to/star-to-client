const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pathOutput = path.resolve(__dirname, "client/dist/js");
const pathTs = path.resolve(__dirname, "client/ts");
const pathScss = path.resolve(__dirname, "client/scss");

module.exports = {
  entry: [pathTs + "/index.ts", pathScss + "/style.scss"],
  output: {
    path: pathOutput,
    filename: "star-to.bundle.js",
  },
  plugins: [new MiniCssExtractPlugin({ filename: "../css/style.css" })],
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
