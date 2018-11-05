export function filterDown(el: HTMLElement, match: string, max: number){
    let c = 0;
    let ns = el.nextElementSibling;
    const ret : Element[] = [];
    while(ns){
        if(ns.matches(match)){
            ret.push(ns);
            c++;
            if(c >= max ) return ret;
        }
        ns = ns.nextElementSibling;
    }
    return ret;
}