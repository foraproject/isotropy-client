import __polyfill from "babel-polyfill";
import setupJSDOM from "./__setup_jsdom";
import loader from "../bundle";
import should from 'should';

describe("Isotropy In DOM", () => {

  it("serves requests", async () => {
    setupJSDOM();

    const apps = [
      {
        type: "webapp",
        routes: [
          {
            url: `/`,
            method: "GET",
            handler: (req, res) => {
              res.end("Hello, world");
              window.finishTest();
            }
          }
        ],
        path: "/",
        onRender: (html) => {
          document.querySelector("#isotropy-container").innerHTML = html;
        }
      }
    ];

    let html = "";

    await new Promise((resolve, reject) => {
      window.finishTest = () => {
        html = document.querySelector("#isotropy-container").innerHTML;
        resolve();
      };

      window.onload = () => {
        __webpack_aliases.isotropy(apps, [__webpack_aliases.webappPlugin], {})
          .catch((e) => console.log(e))
      };
    });

    html.should.equal("Hello, world");
  });
});
