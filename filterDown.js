interface;
export function filterDown(el, match, max, recAtr = null, recMatch = null, topEl = null, acc = null, cnt = null) {
    let c = cnt === null ? 0 : cnt;
    let ns = el;
    const ret = acc === null ? [] : acc;
    const isF = typeof match === 'function';
    while (ns !== null) {
        let isG = isF ? match(ns) : ns.matches(match);
        if (isG) {
            ret.push(ns);
            c++;
            if (c >= max)
                return ret;
        }
        if (recAtr !== null) {
            const attr = ns.getAttribute(recAtr);
            if (attr !== null) {
                let doIt = true;
                if (recMatch !== null) {
                    doIt = !recMatch(topEl);
                }
                if (doIt) {
                    const fc = ns.firstElementChild;
                    if (fc !== null) {
                        filterDown(fc, match, max, recAtr, recMatch, topEl, ret, c);
                    }
                }
            }
        }
        ns = ns.nextElementSibling;
    }
    return ret;
}
//# sourceMappingURL=filterDown.js.map