import { extend } from "@vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProps } from "./patchProp";

// vue dom 的全部操作
const renderOptionDom = extend({ patchProps }, nodeOps);

export {
    renderOptionDom
}