import { debounce } from './debounce.js';
export class NavDown {
    constructor(seed, match, notify, max, mutDebounce = 50) {
        this.seed = seed;
        this.match = match;
        this.notify = notify;
        this.max = max;
        this.mutDebounce = mutDebounce;
        //this.init();
    }
    init() {
        this._debouncer = debounce(() => {
            this.sync();
        }, this.mutDebounce);
        this.sync();
        this.addMutObs(this.seed.parentElement);
    }
    addMutObs(elToObs) {
        if (elToObs === null || elToObs._addedMutObs)
            return;
        this._mutObs = new MutationObserver((m) => {
            this._debouncer(true);
        });
        this._mutObs.observe(elToObs, { childList: true });
        elToObs._addedMutObs = true;
    }
    sync() {
        const isF = typeof this.match === 'function';
        this.matches = [];
        let ns = this.seed.nextElementSibling;
        let c = 0;
        while (ns !== null) {
            let isG = isF ? this.match(ns) : ns.matches(this.match);
            if (isG) {
                this.matches.push(ns);
                c++;
                if (c >= this.max) {
                    this.notify();
                    return;
                }
                ;
            }
            ns = ns.nextElementSibling;
        }
        this.notify();
    }
    disconnect() {
        this._mutObs.disconnect();
    }
}
//# sourceMappingURL=NavDown.js.map