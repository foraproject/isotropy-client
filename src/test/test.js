import __polyfill from "babel-polyfill";
import should from 'should';
import http from "http";
import Router from "isotropy-router";
import promisify from "nodefunc-promisify";
import isotropy from "../isotropy-in-dom";
import querystring from "querystring";
import MyComponent from "./react/my-component";

import webappPlugin from "isotropy-plugin-webapp";
import reactPlugin from "isotropy-plugin-react";

describe("Isotropy In DOM", () => {

  const plugins = [
    webappPlugin,
    reactPlugin
  ];

  let server, router;

  before(async () => {
    const onError = (req, res, e) => {
      res.statusCode = 200;
      res.statusMessage = e.toString();
      res.end(e.toString());
    };
    server = http.createServer((req, res) => {
      var p = router.doRouting(req, res);
      p.catch((e) => onError(req, res, e));
    });
    const listen = promisify(server.listen.bind(server));
    await listen();
  });

  beforeEach(async () => {
    router = new Router();
  });


  it(`Should serve a web app at /`, async () => {
    const routes = [
      { url: "/", method: "get", handler: async (req, res) => res.end("hello, root") }
    ];
    const apps = [{ type: "webapp", routes, path: "/" }];
    await isotropy(apps, plugins, { dir: __dirname, router });
    const data = await makeRequest("localhost", server.address().port, "/", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
    data.should.equal("hello, root");
  });


  it(`Should serve a web app at /webapp`, async () => {
    const routes = [
      { url: "/webapp", method: "get", handler: async (req, res) => res.end("hello, world") }
    ];
    const apps = [{ type: "webapp", routes, path: "/" }];
    await isotropy(apps, plugins, { dir: __dirname, router });
    const data = await makeRequest("localhost", server.address().port, "/webapp", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
    data.should.equal("hello, world");
  });


  it(`Should catch errors`, async () => {
    const routes = [
      { url: "/webapp", method: "get", handler: async (req, res) => { throw "BOMB!"; } }
    ];
    const apps = [{ type: "webapp", routes, path: "/" }];
    await isotropy(apps, plugins, { dir: __dirname, router });
    const data = await makeRequest("localhost", server.address().port, "/webapp", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
    data.should.equal("BOMB!");
  });


  [[false, "hello_nonstatic"], [true, "hello_static"]].forEach(([renderToStaticMarkup, url]) => {
    const strStaticRender = renderToStaticMarkup ? "as static markup" : "as string";
    it(`Should serve a React Component ${strStaticRender} at /ui`, async () => {
      const routes = [
        { url: `/${url}/:id`, method: "GET", component: MyComponent }
      ];
      const apps = [{ type: "react", routes, path: "/ui", renderToStaticMarkup }];
      const options = {
        dir: __dirname,
        router
      };
      await isotropy(apps, plugins, options);
      const data = await makeRequest("localhost", server.address().port, `/ui/${url}/200`, "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
      if (renderToStaticMarkup) {
        data.should.equal("<html><body>Hello 200</body></html>");
      } else {
        data.should.startWith("<html data-reactid");
      }
    });
  });
});
