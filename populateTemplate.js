export function populateTemplate(template, ctx) {
    const df = template.content.cloneNode(true);
    const children = df.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const child = children[i];
        ctx.level = 0;
        ctx.stack = [];
        ctx.leaf = child;
        ctx.el = child;
        process(ctx.el, ctx);
    }
    df.childNodes.forEach(node => {
        process(ctx.el, ctx);
    });
    return ctx;
}
function process(target, context) {
    if (target.matches === undefined)
        return;
    const transform = context.transform;
    const children = target.children;
    const childCount = children.length;
    for (const selector in transform) {
        if (target.matches(selector)) {
            const transformTemplate = transform[selector];
            context.processChildren = false;
            context.el = target;
            transformTemplate(context);
            if (context.processChildren && childCount > 0) {
                context.level++;
                const s = context.stack;
                s.push(target);
                context.leaf = target;
                for (let i = 0; i < childCount; i++) {
                    const child = children[i];
                    //const s = context.stack;
                    //s.push(child);
                    //context.level++;
                    //context.leaf = child;
                    process(child, context);
                    s.pop();
                    context.level;
                }
                s.pop();
                context.level--;
                context.leaf = s.length > 0 ? s[s.length - 1] : null;
            }
        }
    }
}
//# sourceMappingURL=populateTemplate.js.map