export function define(custEl) {
    //const h = document.head;
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
//# sourceMappingURL=define.js.map