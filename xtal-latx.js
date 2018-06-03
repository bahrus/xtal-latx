const pass_down = 'pass-down';
const disabled = 'disabled';
export function XtallatX(superClass) {
    return class extends superClass {
        static get observedAttributes() {
            return [disabled, pass_down];
        }
        get passDown() {
            return this._passDown;
        }
        set passDown(val) {
            this.setAttribute(pass_down, val);
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            if (val) {
                this.setAttribute(disabled, '');
            }
            else {
                this.removeAttribute(disabled);
            }
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case pass_down:
                    if (newVal && newVal.endsWith('}'))
                        newVal += ';';
                    this._passDown = newVal;
                    this.parsePassDown();
                    break;
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const newEvent = new CustomEvent(name + '-changed', {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            return newEvent;
        }
        updateResultProp(val, eventName, propName, callBackFn) {
            if (callBackFn) {
                val = callBackFn(val, this);
                if (!val)
                    return;
            }
            this[propName] = val;
            if (this._cssPropMap) {
                this.passDownProp(val);
            }
            else {
                this.de(eventName, val);
            }
        }
        parsePassDown() {
            this._cssPropMap = [];
            const splitPassDown = this._passDown.split('};');
            splitPassDown.forEach(passDownSelectorAndProp => {
                if (!passDownSelectorAndProp)
                    return;
                const splitPassTo2 = passDownSelectorAndProp.split('{');
                this._cssPropMap.push({
                    cssSelector: splitPassTo2[0],
                    propTarget: splitPassTo2[1]
                });
            });
        }
        passDownProp(val) {
            let nextSibling = this.nextElementSibling;
            while (nextSibling) {
                this._cssPropMap.forEach(map => {
                    if (nextSibling.matches(map.cssSelector)) {
                        nextSibling[map.propTarget] = val;
                    }
                });
                nextSibling = nextSibling.nextElementSibling;
            }
        }
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
//# sourceMappingURL=xtal-latx.js.map