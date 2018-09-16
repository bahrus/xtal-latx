import { debounce } from './debounce.js';
export function getScript(srcScript) {
    const inner = srcScript.innerHTML.trim();
    if (inner.startsWith('(')) {
        const iFatArrowPos = inner.indexOf('=>');
        const c2del = ['(', ')', '{', '}'];
        let lhs = inner.substr(0, iFatArrowPos);
        c2del.forEach(t => lhs = lhs.replace(t, ''));
        const rhs = inner.substr(iFatArrowPos + 2);
        return {
            args: lhs.split(',').map(s => s.trim()),
            body: rhs,
        };
    }
    else {
        return null;
    }
}
export function destruct(target, prop, megaProp = 'input') {
    let debouncers = target._debouncers;
    if (!debouncers)
        debouncers = target._debouncers = {};
    let debouncer = debouncers[megaProp];
    if (!debouncer) {
        debouncer = debouncers[megaProp] = debounce(() => {
            target[megaProp] = Object.assign({}, target[megaProp]);
        }, 10);
    }
    Object.defineProperty(target, prop, {
        get: function () {
            return this['_' + prop];
        },
        set: function (val) {
            this['_' + prop] = val;
            if (this[megaProp]) {
                this[megaProp][prop] = val;
                debouncer();
                //this[megaProp] = Object.assign({}, this[megaProp]);
            }
            else {
                this[megaProp] = { [prop]: val };
            }
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=destruct.js.map