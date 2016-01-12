import http from "http";
import __polyfill from "babel-polyfill";
import should from 'should';
import jsdom from "jsdom";
import koa from "koa";
import querystring from "querystring";
import serverApp from "./app";

describe("Isotropy", () => {

    const makeRequest = (host, port, path, method, headers, _postData) => {
        return new Promise((resolve, reject) => {
            const postData = (typeof _postData === "string") ? _postData : querystring.stringify(_postData);
            const options = { host, port, path, method, headers };

            let result = "";
            const req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) { result += data; });
                res.on('end', function() { resolve(result); });
            });
            req.on('error', function(e) { reject(e); });
            req.write(postData);
            req.end();
        });
    };

it(`Should load an isomorphic page at /`, async () => {
        const defaultInstance = await serverApp();

        const html = await makeRequest("localhost", 8080, `/books/200`, "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});

        //Make sure we got what we wanted.
        html.trim().should.startWith("<html>");

        //Load html in jsdom
        return new Promise(function(resolve, reject) {
            jsdom.env(
                html,
                function (err, window) {
                    if (err) {
                        reject(err);
                    } else {
                        if (window.document.readyState != 'loading'){
                        } else {
                            window.document.addEventListener("DOMContentLoaded", function(event) {
                                resolve("DOM fully loaded and parsed");
                            });
                        }
                    }
                }
            );
        });
    });
});
