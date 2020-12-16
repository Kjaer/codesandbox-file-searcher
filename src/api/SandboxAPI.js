// ToDo: change this with real fetch from endpoint

import sandboxDummy from "./sandbox.json";

export function fetchSandbox() {
  const sandbox = new Promise((resolve, reject) => {
    resolve(sandboxDummy);
  })

  return sandbox;
}

// const API_URL = "https://codesandbox.io/api/v1/sandboxes/84jkx";
//
// export async function fetchSandbox() {
//   const response = await fetch(API_URL);
//   const sandbox = await response.json();
//
//   return sandbox;
// }
