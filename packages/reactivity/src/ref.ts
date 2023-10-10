import { hasChange, isArray } from '@vue/shared';
import { track, trigger } from './effect'
import { TrackOpType, TriggerOpType } from './operations'
import { reactive } from './reactive';

export function ref(value) {
    return createRef(value)
}

export function shallowRef(value) {
    return createRef(value, true)
}

// 创建RefImpl类
class RefImpl {
    public __v_isRef = true
    public _value
    constructor(public rawValue, public _shallow) {
        this._value = reactive(rawValue)
    }

    // 类的属性访问器
    get value() { // 访问器
        track(this, TrackOpType.GET, 'value') // 收集依赖
        return this._value
    }

    set value(newValue) {
        console.log('set value12', newValue)
        debugger
        console.log(newValue)
        if (hasChange(newValue, this.rawValue)) {
            this.rawValue = reactive(newValue)
            this._value = reactive(newValue)
            trigger(this, TriggerOpType.SET, 'value', reactive(newValue))
        }
    }
}
function createRef(rawValue, shallow = false) {
    return new RefImpl(rawValue, shallow)
}

class ObjectRefImpl {
    public __v_isRef = true
    constructor(public target, public key) {

    }
    get value() {
        return this.target[this.key]
    }
    set value(newValue) {
        this.target[this.key] = newValue
    }
}

export function toRef(target, key) {
    return new ObjectRefImpl(target, key)
}

export function toRefs(target) {
    const ret = isArray(target) ? new Array(target.length) : {}
    for (let key in target) {
        ret[key] = toRef(target, key)
    }
    return ret
}