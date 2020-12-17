// ToDo: change this with real fetch from endpoint

// const API_URL = 'https://codesandbox.io/api/v1/sandboxes/84jkx';
const MOCK_API_URL = 'https://run.mocky.io/v3/5ca2c543-14b1-4984-8e3f-96d4cc23b71d';
// this mock api url can be deleted via this url ->
// https://designer.mocky.io/manage/delete/5ca2c543-14b1-4984-8e3f-96d4cc23b71d/codesandbox-kjaer-challenge

export async function fetchSandbox() {
  const response = await fetch(MOCK_API_URL);
  const sandbox = await response.json();

  return sandbox;
}
