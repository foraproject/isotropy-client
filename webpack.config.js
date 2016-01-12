module.exports = {
    context: __dirname,
    entry: "./dist/test/app-browser.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    resolve: {
        alias: {
    		"isotropy-adapter-react": "isotropy-adapter-react-browser",
            "koa": "isotropy-koa-in-browser"
        }
	},
    module: {
		loaders: [
			{ test: /\.json$/,   loader: "json-loader" }
        ]
    }
}
