const disabled = 'disabled';

export function XtallatX(superClass) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled];
        }    
    
        _disabled: boolean;
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }

        attr(name: string, val: string | boolean, trueVal?: string){
            if(val){
                this.setAttribute(name, trueVal || val);
            }else{
                this.removeAttribute(name);
            }
        }
        _evCount: {[key: string] : number} = {};
        incAttr(name){
            const ec = this._evCount;
            if(!ec[name]) {
                ec[name] = 1;
            }else{
                ec[name]++;
            }
            this.attr(name, ec[name].toString());
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
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            })
    
        }
    }
}