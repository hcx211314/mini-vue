export const patchClass = (el, value) => {
    // 处理
    if (value == null) {
        value = ''
    }
    // 对这个标签的class进行赋值
    el.className = value
}