type test = (el: Element | null) => boolean;
export interface 
export function filterDown(el: Element | null, match: string | test, max: number, recAtr: string | null = null, 
    recMatch: test | null = null, topEl: Element | null = null, acc: Element[] | null = null, cnt: number | null = null){
    let c = cnt === null ?  0 : cnt;
    let ns = el;
    const ret : Element[] = acc === null ? [] : acc;
    const isF = typeof match === 'function';
    while(ns !== null){
        let isG = isF ? (<any>match)(ns) : ns.matches(match as string);
        if(isG){
            ret.push(ns);
            c++;
            if(c >= max ) return ret;
        }
        if(recAtr !== null){
            const attr = ns.getAttribute(recAtr);
            if(attr !== null){
                let doIt = true;
                if(recMatch !== null){
                    doIt = !recMatch(topEl)
                }
                if(doIt){
                    const fc = ns.firstElementChild;
                    if(fc !== null){
                        filterDown(fc, match, max, recAtr, recMatch, topEl, ret, c)
                    }
                }
            }
        }
        ns = ns.nextElementSibling;
    }
    return ret;
}