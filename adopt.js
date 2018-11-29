import { qsa } from './qsa.js';
export function adopt(dynamicSlotSelector, container, targetElementSelector, postAdopt) {
    qsa(dynamicSlotSelector, container.shadowRoot).forEach(el => {
        el.addEventListener('slotchange', e => {
            container.assignedNodes().forEach(node => {
                if (node.nodeType === 3)
                    return;
                const nodeEl = node;
                const targetEl = container.shadowRoot.querySelector(targetElementSelector);
                if (nodeEl.hasAttribute('disabled') && Object.getOwnPropertyDescriptor(nodeEl, 'target')) {
                    nodeEl.removeAttribute('disabled');
                    nodeEl['target'] = targetEl;
                }
            });
            if (postAdopt !== null)
                postAdopt(el);
        });
    });
}
//# sourceMappingURL=adopt.js.map