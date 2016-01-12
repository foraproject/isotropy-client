import "babel-polyfill";

import isotropy from "isotropy";
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
            path: "/",
            renderToStaticMarkup: false,
            toHtml: (html, args, data) => {
                const strData = data ? `<script id="isotropy-data-container" type="application/json">${JSON.stringify(data)}</script>` : ``;
                return (`
                    <html>
                        <head>
                            <script src="/static/bundle.js"></script>
                            ${strData}
                        </head>
                        <body>
                            <div id="isotropy-container">
                                ${html}
                            </div>
                        </body>
                    </html>
                `);
            }
        }
    ];

    const port = process.argv.length >= 3 ? process.argv[2] : 1950;
    return await isotropy(appConfig, __dirname, port);
};
