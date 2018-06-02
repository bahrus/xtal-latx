const pass_down = 'pass-down';
const disabled = 'disabled';

export interface ICssPropMap {
    cssSelector: string;
    //propMapper: {[key: string]: string[]}
    propTarget: string;
}
export function XtallatX(superClass) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled, pass_down];
        }
    
        _passDown: string;
        get passDown() {
            return this._passDown;
        }
        set passDown(val) {
            this.setAttribute(pass_down, val);
        }
    
        _disabled: boolean;
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            if (val) {
                this.setAttribute(disabled, '');
            } else {
                this.removeAttribute(disabled);
            }
        }
    
        attributeChangedCallback(name: string, oldVal: string, newVal: string) {
            switch (name) {
                case pass_down:
                    this._passDown = newVal;
                    this.parsePassDown();
                    break;
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
        _cssPropMap: ICssPropMap[];
        parsePassDown() {
            this._cssPropMap = [];
            const splitPassDown = this._passDown.split('};');
            splitPassDown.forEach(passDownSelectorAndProp => {
                if (!passDownSelectorAndProp) return;
                const splitPassTo2 = passDownSelectorAndProp.split('{');
                this._cssPropMap.push({
                    cssSelector: splitPassTo2[0],
                    propTarget: splitPassTo2[1]
                });
            })
    
        }
        passDownProp(val: any) {
            let nextSibling = this.nextElementSibling;
            while (nextSibling) {
                this._cssPropMap.forEach(map => {
                    if (nextSibling.matches(map.cssSelector)) {
                        nextSibling[map.propTarget] = val;
                    }
                })
                nextSibling = nextSibling.nextElementSibling;
            }
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