const path = require("path");
const PACKAGE = require('./package.json');
const version = PACKAGE.version;



const config = {
    // TODO: Add common Configuration
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
};

const fooConfig = Object.assign({}, config, {
    name: "header_react_next",
    entry: "./src/index.js",
    output: {
        path: path.resolve("build"),
        libraryTarget: "umd",
        library: "header",
        globalObject: 'this', //  add this option
        filename: `index.js`
    },
    externals: {
        'react': 'react'
    }
});


// Return Array of Configurations
module.exports = [
    fooConfig
];
