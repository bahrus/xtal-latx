import {debounce} from './debounce.js';
type ElTest = (el: Element | null) => boolean;
export class NavDown{
    _debouncer!: any;
    constructor(public seed: Element, public match: string | ElTest, public notify:() => void, public max: number, public mutDebounce: number = 50){
        //this.init();
    }
    init(){      
        this._debouncer = debounce(() =>{
            this.sync();
        }, this.mutDebounce);
        this.sync();
        this.addMutObs(this.seed.parentElement);
    }
    addMutObs(elToObs: Element | null) {
        if(elToObs === null || (<any>elToObs)._addedMutObs) return;
        this._mutObs = new MutationObserver((m: MutationRecord[]) => {
            this._debouncer(true);
        });
        this._mutObs.observe(elToObs, { childList: true });
        (<any>elToObs)._addedMutObs = true;
    }
    sync(){
        const isF = typeof this.match === 'function';
        this.matches = [];
        let ns = this.seed.nextElementSibling;
        let c = 0;
        while(ns !== null){
            let isG = isF ? (<any>this.match)(ns) : ns.matches(this.match as string);
            if(isG){
                this.matches.push(ns);
                c++;
                if(c >= this.max ) {
                    this.notify();
                    return;
                };
            }
            ns = ns.nextElementSibling;
        }
        this.notify();
    }
    _mutObs!: MutationObserver;
    public matches!: Element[];
    disconnect(){
        this._mutObs.disconnect();
    }
}