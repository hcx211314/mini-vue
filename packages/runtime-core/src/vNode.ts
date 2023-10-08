import { ShapeFlags, isArray, isObject, isString } from "@vue/shared"

// 创建虚拟节点 createVNode与h一致
// 注意： createVNode = h('div', {className: ''}, [])
export const createVNode = (type, props, children = null) => {
    // 1. 根据type 来区分是组件还是普通的元素
    // 2. 根据type 来创建虚拟节点
    // 3. 根据props 来添加属性
    // 4. 根据children 来添加子节点
    // 5. 返回虚拟节点
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT :
        isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
    const vnode = {
        _v_isVnode: true, // 是一个虚拟节点
        type,
        props,
        children,
        key: props && props.key, // diff 会用到
        el: null, // 对应真实节点
        shapeFlag
    }
    // 儿子标识
    normlizeChildren(vnode, children);
    return vnode
}

function normlizeChildren(vNode, children) {
    let type = 0;
    if (children === null) {

    } else if (isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN
    } else {
        type = ShapeFlags.TEXT_CHILDREN
    }
    vNode.shapeFlag = vNode.shapeFlag | type
}