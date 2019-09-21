const webpack = require("webpack");
const pkg = require("./package.json");
const path = require("path");
const libraryName = pkg.name;
module.exports = {
    entry: path.join(__dirname, "./src/index.js"),
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "react-semantic-popup.js",
        library: libraryName,
        libraryTarget: "umd",
        publicPath: "/dist/",
        umdNamedDefine: true
    },
    plugins: [],
    node: {
        net: "empty",
        tls: "empty",
        dns: "empty"
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            fallback: "file-loader",
                            name: "[name][md5:hash].[ext]",
                            outputPath: "assets/",
                            publicPath: "/assets/"
                        }
                    }
                ]
            },
            {
                test: /\.*css$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ],
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                resolve: { extensions: [".js", ".jsx"] }
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(pdf|doc|zip)$/,
                use: ["file-loader"]
            }
        ]
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, "./node_modules/react"),
            "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
            assets: path.resolve(__dirname, "assets")
        }
    },
    externals: {
        // Don't bundle react or react-dom
        react: {
            commonjs: "react",
            commonjs2: "react",
            amd: "React",
            root: "React"
        },
        "react-dom": {
            commonjs: "react-dom",
            commonjs2: "react-dom",
            amd: "ReactDOM",
            root: "ReactDOM"
        }
    }
};
