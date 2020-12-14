import sandboxDummy from "./sandbox.json";

const API_URL = "https://codesandbox.io/api/v1/sandboxes/84jkx";

// ToDo: change this with real fetch from endpoint
export function fetchSandbox() {
  const sandbox = new Promise((resolve, reject) => {
    resolve(sandboxDummy);
  })

  return sandbox;
}
