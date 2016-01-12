import "babel-polyfill";

import isotropy from "../isotropy-client-mode";
import MyComponent from "./react/my-component";

export default async function() {
    //Configure server
    const appConfig = [
        {
            type: "react",
            module: {
                routes: [
                    { url: `/books/:id`, method: "GET", component: MyComponent }
                ]
            },
            path: "/"
        }
    ];

    const port = process.argv.length >= 3 ? process.argv[2] : 1950;
    return await isotropy(appConfig, __dirname, port);
};
