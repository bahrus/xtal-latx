const pass_down = 'pass-down';
const disabled = 'disabled';
const max_matches = 'max_matches';

export interface ICssPropMap {
    cssSelector: string;
    propTarget: string;
    propSource?: string;
}
export function XtallatX(superClass) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled, pass_down, max_matches];
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
        _hasMax: boolean;
        _maxMatches: number;
        get maxMatches(){
            return this._maxMatches;
        }
        set maxMatches(val){
            this.setAttribute(max_matches, val.toString());
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
                case max_matches:
                    if(newVal){
                        this._hasMax = true;
                        this._maxMatches = parseInt(newVal);
                    }else{
                        this._maxMatches = -1;
                        this._hasMax = false;
                    }
                    
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
        _lastResult: any;
        updateResultProp(val: any, eventName: string, propName: string, callBackFn?: any){
            if(callBackFn){
                val = callBackFn(val, this);
                if(!val) return;
            }
            this[propName] = val;
            if(this._cssPropMap){
                this.passDownProp(val);
                this._lastResult = val;
            }else{
                this.de(eventName, val);
            }
        }
        
        _cssPropMap: ICssPropMap[];
        _addedMutationObserver: boolean;
        parsePassDown() {
            this._cssPropMap = [];
            const splitPassDown = this._passDown.split('};');
            splitPassDown.forEach(passDownSelectorAndProp => {
                if (!passDownSelectorAndProp) return;
                const mapTokens = passDownSelectorAndProp.split('{');
                const splitPropPointer = mapTokens[1].split(':');
                let cssSelector = mapTokens[0];
                if(!cssSelector){
                    cssSelector = "*";
                    this.maxMatches = 1;
                }
                this._cssPropMap.push({
                    cssSelector: cssSelector,
                    propTarget:splitPropPointer[0],
                    propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : null
                });
            })
            if(!this._addedMutationObserver){
                this.addMutationObserver();
            }
        }
        _observer: MutationObserver;
        disconnectObserver(){
            if(this._observer)  this._observer.disconnect();
        }
        addMutationObserver(){
            const config = { childList: true};
            this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
                this.passDownProp(this._lastResult);
            });
            this._observer.observe(this.parentElement, config);
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
            let count = 0;
            while (nextSibling) {
                this._cssPropMap.forEach(map => {
                    if (map.cssSelector === '*' || nextSibling.matches(map.cssSelector)) {
                        count++;
                        nextSibling[map.propTarget] = this.getPropFromPath(val, map.propSource);
                    }
                })
                if(this._hasMax && count >= this._maxMatches) break;
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