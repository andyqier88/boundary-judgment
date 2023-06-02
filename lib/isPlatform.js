const userAgentData = navigator.userAgentData;
const { platform } = userAgentData;

export function isMac() {
  return /mac/i.test(platform || navigator.platform);
}

export function isWindows() {
  return /win/i.test(platform || navigator.platform);
}