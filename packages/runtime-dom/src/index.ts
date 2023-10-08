import { extend } from "@vue/shared";
import { createRander} from '@vue/runtime-core'
import { nodeOps } from "./nodeOps";
import { patchProps } from "./patchProp";

// vue dom 的全部操作
const renderOptionDom = extend({ patchProps }, nodeOps);

export const createApp = (rootComponent, rootProps) => {
    const app = createRander(renderOptionDom).createApp(rootComponent, rootProps);
    let { mount } = app
    app.mount = function (container) {
        container = nodeOps.querySelector(container);
        container.innerHTML = ``;
        this._container = container;
        mount(container);
    }
    return app;
}

export {
    renderOptionDom
}