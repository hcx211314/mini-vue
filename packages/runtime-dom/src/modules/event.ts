

export const patchEvenet = (el, key, value) => {
    const invokers = el._vei || (el._vei = {})
    const exists = invokers[key]
    if (exists && value) {
        exists.value = value

    } else {
        // 获取事件名称 1. 新的有 2. 新的没有
        const eventName = key.slice(2).toLowerCase()
        if (value) {
            let invoker = invokers[eventName] = createInvoker(value)
            el.addEventListener(eventName, invoker)
        } else {
            // 新的没有
            el.removeEventListener(eventName, exists)
            invokers[eventName] = undefined
        }
    }
}

function createInvoker(value) {
    const invoker = (e) => {
        invoker.value(e)
    }
    invoker.value = value
    return invoker
}