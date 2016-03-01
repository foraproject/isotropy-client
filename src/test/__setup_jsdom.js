import jsdom from "jsdom";

const setupJSDOM = function() {
  const document = jsdom.jsdom('<!doctype html><html><body><div id="isotropy-container"></div></body></html>', { url: "http://example.com"});
  global.document = document;
  global.window = document.defaultView;
  global.history = document.history;
  global.navigator = window.navigator;
  global.navigator = { userAgent: "Node.JS" };
  global.history = window.history;
};

setupJSDOM();

export default setupJSDOM;
