export const nodeOps = {
    createElement: tagName => document.createElement(tagName),
    remove: child => {
        let parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },
    insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
    },
    querySelector: select => document.querySelector(select),
    setElementText: (el, text) => {
        el.textContent = text;
    },
    createTextNode: text => document.createTextNode(text),
    setText: (node, text) => node.text = text
}