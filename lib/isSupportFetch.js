import { isBrowser } from './isBrowser.js'
let envVars = isBrowser ? window : global

 function supportFetch() {
  if (!("fetch" in envVars)) {
    return false;
  }
  try {
    new Headers();
    new Request("");
    new Response();
    return true;
  } catch (e) {
    return false;
  }
}
export const isSupportFetch = supportFetch();