// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [
		
	],
	module: {
		rules: [
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: "asset",
			},

			
		],
	},
	devServer: {
		open: true,
		hot: true,
		port: 1506,
		host: "0.0.0.0",
		static: {
			directory: path.resolve(__dirname, "public"),
		}
		
	}
};

module.exports = () => {
	if (isProduction) {
		config.mode = "production";
        
        
	} else {
		config.mode = "development";
	}
	return config;
};
