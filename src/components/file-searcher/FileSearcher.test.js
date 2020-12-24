import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FileSearcher from "./FileSearcher";
import MiniSearch from "minisearch";
import { fetchSandbox } from "../../api/SandboxAPI";

jest.mock("../../api/SandboxAPI");

describe("FileSearcher", () => {
  beforeEach(() => {
    fetchSandbox.mockReturnValue(
      Promise.resolve({
        data: {
          modules: [
            {
              code:
                "import React from 'react'\nimport { Element } from 'react-ui'\n\nfunction OpenInSandbox(props) {\n  return null\n  return (\n    <Element\n      as=\"a\"\n      href={'https://codesandbox.io/s/' + props.id}\n      css={{\n        position: 'absolute',\n        bottom: 20,\n        right: 20,\n        border: '1px solid',\n        borderColor: 'grays.200',\n        color: 'white',\n        backgroundColor: 'grays.700',\n        borderRadius: 3,\n        padding: 2,\n        textDecoration: 'none'\n      }}\n    >\n      Open Sandbox\n    </Element>\n  )\n}\n\nexport default OpenInSandbox\n",
              directory_shortid: "zY62q",
              id: "51cc310c-a7df-4120-81b5-d50e83d662f0",
              inserted_at: "2019-10-04T11:23:11",
              is_binary: false,
              sha: null,
              shortid: "xyR23",
              source_id: "df1e52c9-44fe-4121-b9b6-ade9efcccad4",
              title: "open-in-sandbox.js",
              updated_at: "2020-12-01T15:26:42",
              upload_id: null
            },
            {
              code:
                '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta\n      name="viewport"\n      content="width=device-width, initial-scale=1, shrink-to-fit=no"\n    />\n    <meta name="theme-color" content="#000000" />\n    <title>File Tree</title>\n    <!--\n      manifest.json provides metadata used when your web app is added to the\n      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/\n    -->\n    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />\n    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />\n    <!--\n      Notice the use of %PUBLIC_URL% in the tags above.\n      It will be replaced with the URL of the `public` folder during the build.\n      Only files inside the `public` folder can be referenced from the HTML.\n\n      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will\n      work correctly both with client-side routing and a non-root public URL.\n      Learn how to configure a non-root public URL by running `npm run build`.\n    -->\n    <title>React App</title>\n  </head>\n\n  <body>\n    <noscript>\n      You need to enable JavaScript to run this app.\n    </noscript>\n    <div id="root"></div>\n    <!--\n      This HTML file is a template.\n      If you open it directly in the browser, you will see an empty page.\n\n      You can add webfonts, meta tags, or analytics to this file.\n      The build step will place the bundled scripts into the <body> tag.\n\n      To begin the development, run `npm start` or `yarn start`.\n      To create a production bundle, use `npm run build` or `yarn build`.\n    -->\n  </body>\n</html>\n',
              directory_shortid: "rgkK4",
              id: "a41760e1-63f2-4c67-991d-d5d12cb4aca7",
              inserted_at: "2019-10-04T09:31:18",
              is_binary: false,
              sha: null,
              shortid: "BA1N",
              source_id: "df1e52c9-44fe-4121-b9b6-ade9efcccad4",
              title: "index.html",
              updated_at: "2019-10-04T12:20:50",
              upload_id: null
            }
          ]
        }
      })
    );
  });

  it("Search can be performed with Enter Key", async () => {
    const searchSpy = jest
      .spyOn(MiniSearch.prototype, "search")
      .mockImplementation(() => []);

    await waitFor(() => {
      render(<FileSearcher />);
    });

    userEvent.type(
      screen.getByTestId("csbx-file-search-text-input"),
      "import{enter}"
    );
    expect(searchSpy).toHaveBeenCalled();

    //restore back
    MiniSearch.prototype.search.mockRestore();
  });

  it("Default search is not case sensitive", async () => {
    await waitFor(() => {
      render(<FileSearcher />);
    });
    debugger;
    // in order to check search going to be performed with case insensitive, execute the search
    // and check the result. case sensitive search will return different results.

    userEvent.type(
      screen.getByTestId("csbx-file-search-text-input"),
      "react{enter}"
    );
    expect(
      screen.getByTestId(
        "csbx-file-search-file-occurrence-list-51cc310c-a7df-4120-81b5-d50e83d662f0"
      ).children.length
    ).toEqual(3);
  });

  it("Case sensitive results are different than case insensitive", async () => {
    await waitFor(() => {
      render(<FileSearcher />);
    });

    userEvent.type(
      screen.getByTestId("csbx-file-search-text-input"),
      "react{enter}"
    );
    expect(
      screen.getByTestId(
        "csbx-file-search-file-occurrence-list-51cc310c-a7df-4120-81b5-d50e83d662f0"
      ).children.length
    ).toEqual(3);

    userEvent.click(
      screen.getByTestId("csbx-file-search-case-sensitivity-toggle")
    );
    userEvent.clear(screen.getByTestId("csbx-file-search-text-input"));
    userEvent.type(
      screen.getByTestId("csbx-file-search-text-input"),
      "React{enter}"
    );
    expect(
      screen.getByTestId(
        "csbx-file-search-file-occurrence-list-51cc310c-a7df-4120-81b5-d50e83d662f0"
      ).children.length
    ).toEqual(1);
  });

  it("Search results are grouped by file names", async () => {
    await waitFor(() => {
      render(<FileSearcher />);
    });

    userEvent.type(
      screen.getByTestId("csbx-file-search-text-input"),
      "react{enter}"
    );
    expect(
      screen.getByTestId(
        "csbx-file-search-file-name-51cc310c-a7df-4120-81b5-d50e83d662f0"
      )
    ).not.toBeNull();
    expect(
      screen.getByTestId(
        "csbx-file-search-file-name-a41760e1-63f2-4c67-991d-d5d12cb4aca7"
      )
    ).not.toBeNull();
  });

  it("Search term is highlighted on the result", async () => {
    await waitFor(() => {
      render(<FileSearcher />);
    });

    userEvent.type(
      screen.getByTestId("csbx-file-search-text-input"),
      "React{enter}"
    );
    expect(
      screen.getByTestId(
        "csbx-file-search-highlighted-term-51cc310c-a7df-4120-81b5-d50e83d662f0-0"
      )
    ).not.toBeNull();
  });
});
