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
        attributeChangedCallback(name: string, oldVal: string, newVal: string) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name: string, detail: any) {
            const newEvent = new CustomEvent(name + '-changed', {
                detail: detail,
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
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