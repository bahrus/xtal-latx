import { XtallatX } from './XtallatX.js';
export class xtalLatx extends XtallatX(HTMLElement) {
    static get is() { return 'xtal-latx'; }
    ;
    connectedCallback() {
        super.connectedCallback();
    }
}
if (!customElements.get(xtalLatx.is)) {
    customElements.define(xtalLatx.is, xtalLatx);
}
//# sourceMappingURL=xtal-latx.js.map