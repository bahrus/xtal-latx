const disabled = 'disabled';

type Constructor<T = {}> = new (...args: any[]) => T;

export function XtallatX<TBase extends Constructor<HTMLElement>>(superClass: TBase) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled];
        }    
    
        _disabled!: boolean;
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }

        attr(name: string, val: string | boolean, trueVal?: string){
            const v = val ? 'set' : 'remove';  //verb
            (<any>this)[v + 'Attribute'](name, trueVal || val);
        }
        _evCount: {[key: string] : number} = {};
        to$(n: number){
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        incAttr(name: string){
            const ec = this._evCount;
            if(name in ec) {
                ec[name]++;
            }else{
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name: string, oldVal: string, newVal: string) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name: string, detail: any) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }

        _upgradeProperties(props: string[]) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = (<any>this)[prop];
                    delete (<any>this)[prop];
                    (<any>this)[prop] = value;
                }
            })
    
        }
    }
}