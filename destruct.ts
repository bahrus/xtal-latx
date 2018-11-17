import {debounce} from './debounce.js';
export interface IScriptInfo{
    args: string[],
    body: string,
}
export function  getScript(srcScript: HTMLScriptElement) : IScriptInfo | null{
    const inner = srcScript.innerHTML.trim();
    inner.replace('tr = ', '');
    if(inner.startsWith('(')){
        const ied = (<any>self)['xtal_latx_ied']; //IE11
        if(ied !== undefined){ 
            return ied(inner);
        }else{
            const iFatArrowPos = inner.indexOf('=>');
            const c2del = ['(', ')', '{', '}'];
            let lhs = inner.substr(0, iFatArrowPos);
            c2del.forEach(t => lhs = lhs.replace(t, ''));
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                body: rhs,
            }
        }
        
    }else{
        return null;
    }
    
}

export function destruct(target: HTMLElement, prop: string, megaProp: string = 'input'){
    let debouncers = (<any>target)._debouncers;
    if(!debouncers) debouncers =  (<any>target)._debouncers = {};
    let debouncer = debouncers[megaProp];
    if(!debouncer){
        debouncer = debouncers[megaProp] = debounce(() => {
            (<any>target)[megaProp] = Object.assign({}, (<any>target)[megaProp]);
        }, 10);  //use task sceduler?
    }
    Object.defineProperty(target, prop, {
        get: function () {
            return this['_' + prop];
        },
        set: function (val) {
            this['_' + prop] = val;
            if(this[megaProp]) {
                this[megaProp][prop] = val;
                debouncer();
                //this[megaProp] = Object.assign({}, this[megaProp]);
            }else{
                this[megaProp] = {[prop]: val}; 
            }
        },
        enumerable: true,
        configurable: true,
    });
}