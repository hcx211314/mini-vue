import { hasChange, isArray } from '@vue/shared';
import { track, trigger } from './effect'
import { TrackOpType, TriggerOpType } from './operations'

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
        this._value = rawValue
    }

    // 类的属性访问器
    get value() { // 访问器
        track(this, TrackOpType.GET, 'value') // 收集依赖
        return this._value
    }

    set value(newValue) {
        if (hasChange(newValue, this.rawValue)) {
            this.rawValue = newValue
            this._value = newValue
            trigger(this, TriggerOpType.SET, 'value', newValue)
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