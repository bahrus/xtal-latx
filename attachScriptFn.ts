export function attachScriptFn(tagName: string, target: any, prop: string, body: string){
    const constructor = customElements.get(tagName);
    const count = constructor._count++;
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
${body}
const constructor = customElements.get('${tagName}');
constructor['fn_' + ${count}] = __fn;
`;
    document.head.appendChild(script);
}

function attachFn(constructor: any, count: number, target: any, prop: string){
    const Fn = constructor['fn_' + count];
    if(Fn === undefined){
        setTimeout(() => {
            attachFn(constructor, count, target, prop);
        }, 10);
        return;
    }
    target[prop] = Fn;
} 