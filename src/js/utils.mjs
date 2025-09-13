// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get a query parameter value
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

/**
 * renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false)
 * Reusable renderer for mapping a list of data items to a single HTML template function.
 * - templateFn: (item) => string
 * - parentElement: Element to insert into
 * - list: array of items
 * - position: insertAdjacentHTML position (default "afterbegin")
 * - clear: if true, empties parentElement before inserting
 */
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (!parentElement) return;
  if (clear) parentElement.innerHTML = "";
  const htmlStrings = (list ?? []).map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}