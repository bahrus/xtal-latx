export function filterDown(el, match, max) {
    let c = 0;
    let ns = el.nextElementSibling;
    const ret = [];
    while (ns) {
        if (ns.matches(match)) {
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