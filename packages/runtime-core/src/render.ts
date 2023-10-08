import { apiCreateApp } from './ApiCreateApp'
export function createRander(renderOptionDom) {// 实现渲染
    const render = (vNode, container) => {
        // 组件初始化
    }
    return {
        createApp: apiCreateApp(render) // 创建虚拟DOM
    }
}
// 