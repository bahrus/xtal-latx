export function filterDown(el, match, max) {
    let c = 0;
    let ns = el.nextElementSibling;
    const ret = [];
    const isF = typeof match === 'function';
    while (ns) {
        let isG = typeof match === 'function' ? match(ns) : ns.matches(match);
        if (isG) {
            ret.push(ns);
            c++;
            if (c >= max)
                return ret;
        }
        ns = ns.nextElementSibling;
    }
    return ret;
}
//# sourceMappingURL=filterDown.js.map