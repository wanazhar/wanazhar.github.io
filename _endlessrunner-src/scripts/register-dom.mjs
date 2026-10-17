/**
 * Browser stubs for the behavioural tests.
 *
 * The game modules run in the browser, so a plain Node process needs two
 * things before they can be imported: Vite's `import.meta.env.BASE_URL` (see
 * asset-env-hook.mjs) and a sliver of `document` — three's TextureLoader
 * builds an `<img>` at module load, and the HUD queries elements. The stub is
 * deliberately tiny: the tests exercise game state and DOM structure, never
 * layout or rendering.
 */
import { register } from 'node:module';

register('./asset-env-hook.mjs', import.meta.url);

export class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.children = [];
    this.parentNode = null;
    this.textContent = '';
    this.innerHTML = '';
    this.className = '';
    this.hidden = false;
    this.value = '';
    this.dataset = {};
    this.style = {};
  }

  get childElementCount() {
    return this.children.length;
  }

  get firstChild() {
    return this.children[0] ?? null;
  }

  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  insertBefore(child, reference) {
    const index = reference ? this.children.indexOf(reference) : -1;
    if (index === -1) this.children.push(child);
    else this.children.splice(index, 0, child);
    child.parentNode = this;
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) this.children.splice(index, 1);
    child.parentNode = null;
    return child;
  }

  remove() {
    this.parentNode?.removeChild(this);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  removeAttribute(name) {
    delete this[name];
  }

  addEventListener() {}
  removeEventListener() {}
}

globalThis.document = {
  createElement: (tagName) => new FakeElement(tagName),
  createElementNS: (_namespace, tagName) => new FakeElement(tagName),
  querySelector: () => new FakeElement('div'),
  querySelectorAll: () => [],
  documentElement: new FakeElement('html'),
  addEventListener() {},
  removeEventListener() {}
};
