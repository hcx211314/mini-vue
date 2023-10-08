import { createVNode} from './vNode'
export function apiCreateApp(render) { // 告诉他是那个组件，那个属性
    return function createApp(rootComponent, rootProps) {
        let app = {
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            mount(container) {
                // 渲染时，会将组件转换成虚拟节点
                // 1. 根据组件创建虚拟节点
                // 2. 将虚拟节点和容器进行关联
                // 3. 将虚拟节点中的内容渲染到容器中
                const vNode = createVNode(rootComponent, rootProps);
                console.log(vNode)
                render(vNode, container);
                app._container = container;
            }
        }
        return app
    }
}