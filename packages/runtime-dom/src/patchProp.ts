import { patchClass } from "./modules/class";
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attr'
import { patchEvenet } from './modules/event'

export const patchProps = (el, key, prevValue, nextValue) => {
    switch (key) {
        case 'class':
            patchClass(el, nextValue)
            break;
        case 'style':
            patchStyle(el, prevValue, nextValue)
            break;
        default:
            if (/^on[^a-z]/.test(key)) {
                patchEvenet(el, key, nextValue)
            } else {
                patchAttr(el, key, nextValue)
            }
            break
    }
}