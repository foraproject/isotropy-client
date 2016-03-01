/* @flow */
import http from "isotropy-http-in-browser";
import getIsotropy from "isotropy-core";
import urlMiddleware from "isotropy-middleware-url";
import Router from "isotropy-router";
import getPage from "isotropy-page";
import type { PluginType } from "isotropy-core";
import type { IsotropyOptionsType, IsotropyResultType } from "isotropy-core";
import type { IncomingMessage, ServerResponse, Server } from "./flow/http";

type IsotropyFnType = (apps: Object, options: IsotropyOptionsType) => Promise<IsotropyResultType>;

export default async function(apps: Object, plugins: Array<PluginType>, options: IsotropyOptionsType) : Promise<IsotropyResultType> {
  const page = getPage();
  const isotropy: IsotropyFnType = getIsotropy(plugins);

  options.handler = (router: Router) => (req: IncomingMessage, res: ServerResponse) => {
    urlMiddleware(req, res)
    .then(() => router.doRouting(req, res));
  };

  const result = await isotropy(apps, options);
  const server = result.server;

  page('*', () => {
    const req = new http.IncomingMessage();
    req.method = "GET";
    req.url = window.location.href;
    const res = new http.ServerResponse();
    server.requestListener(req, res);
  });
  page();
  server.page = page;
  return result;
};
