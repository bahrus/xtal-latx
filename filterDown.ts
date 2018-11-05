type test = (el: Element) => boolean;
export function filterDown(el: HTMLElement, match: string | test, max: number){
    let c = 0;
    let ns = el.nextElementSibling;
    const ret : Element[] = [];
    const isF = typeof match === 'function';
    while(ns){
        let isG = isF ? (<any>match)(ns) : ns.matches(match as string);
        if(isG){
            ret.push(ns);
            c++;
            if(c >= max ) return ret;
        }
        ns = ns.nextElementSibling;
    }
    return ret;
}