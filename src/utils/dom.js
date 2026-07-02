// Các hàm tiện ích DOM
export function $(selector, context = document) {
  return context.querySelector(selector);
}

export function $$(selector, context = document) {
  return [...context.querySelectorAll(selector)];
}

export function createElement(tag, className = '', innerHTML = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

export function addClass(el, className) {
  if (el) el.classList.add(className);
}

export function removeClass(el, className) {
  if (el) el.classList.remove(className);
}

export function toggleClass(el, className) {
  if (el) el.classList.toggle(className);
}

export function hasClass(el, className) {
  return el ? el.classList.contains(className) : false;
}

export function on(el, event, handler) {
  if (el) el.addEventListener(event, handler);
}

export function off(el, event, handler) {
  if (el) el.removeEventListener(event, handler);
}

export function setText(el, text) {
  if (el) el.textContent = text;
}

export function setHTML(el, html) {
  if (el) el.innerHTML = html;
}

export function getData(el, key) {
  return el ? el.dataset[key] : undefined;
}

export function setData(el, key, value) {
  if (el) el.dataset[key] = value;
}