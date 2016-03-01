module.exports = {
    context: __dirname,
    entry: "./dist/test/loader.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    resolve: {
        alias: {
          "http": "isotropy-http-in-browser",
    		  "isotropy-adapter-webapp": "isotropy-adapter-webapp-in-dom"
        }
	},
    module: {
		loaders: [
			{ test: /\.json$/,   loader: "json-loader" }
        ]
    }
}
