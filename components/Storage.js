const RUNNER_STORAGE_KEY = "js-runner:code";

function loadSavedCode() {
  try {
    return localStorage.getItem(RUNNER_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function saveCode(code) {
  try {
    localStorage.setItem(RUNNER_STORAGE_KEY, code);
  } catch (e) {
    /* ignore — private mode / storage disabled */
  }
}