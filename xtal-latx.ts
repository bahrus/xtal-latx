const pass_down = 'pass-down';
const disabled = 'disabled';

export interface ICssPropMap {
    cssSelector: string;
    propTarget: string;
    propSource?: string;
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
                    if(newVal && newVal.endsWith('}')) newVal += ';';
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
        updateResultProp(val: any, eventName: string, propName: string, callBackFn?: any){
            if(callBackFn){
                val = callBackFn(val, this);
                if(!val) return;
            }
            this[propName] = val;
            if(this._cssPropMap){
                this.passDownProp(val);
            }else{
                this.de(eventName, val);
            }
        }
        _cssPropMap: ICssPropMap[];
        parsePassDown() {
            this._cssPropMap = [];
            const splitPassDown = this._passDown.split('};');
            splitPassDown.forEach(passDownSelectorAndProp => {
                if (!passDownSelectorAndProp) return;
                const mapTokens = passDownSelectorAndProp.split('{');
                const splitPropPointer = mapTokens[1].split(':');
                this._cssPropMap.push({
                    cssSelector: mapTokens[0],
                    propTarget:splitPropPointer[0],
                    propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : null
                });
            })
    
        }
        getPropFromPath(val: any, path: string){
            if(!path) return val;
            let context = val;
            path.split('.').forEach(token =>{
                if(context) context = context[token];
            })
            return context;
        }
        passDownProp(val: any) {
            let nextSibling = this.nextElementSibling;
            while (nextSibling) {
                this._cssPropMap.forEach(map => {
                    if (nextSibling.matches(map.cssSelector)) {
                        nextSibling[map.propTarget] = this.getPropFromPath(val, map.propSource);
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