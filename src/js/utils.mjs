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
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

//render the template
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

//load the template
export async function loadTemplate(path) {
  // use fetch to get the template
  const res = await fetch(path);
  // await for the response in res
  const template = await res.text();
  return template;
}

export function loadHeaderFooter() {
  // load the header
  loadTemplate("./partials/header.html")
    .then((template) => {
      renderWithTemplate(template, qs("header#main-header"));
    })
    .catch((err) => {
      console.error(err);
    });
  // load the footer
  loadTemplate("./partials/footer.html")
    .then((template) => {
      renderWithTemplate(template, qs("footer#main-footer"));
    })
    .catch((err) => {
      console.error(err);
    });
}
