import { isObject,extend } from '@vue/shared';
import { readonly, reactive} from './index'
import { track, trigger } from './effect'


export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target,key, receiver) {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      // track(target, key)
    }
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res) // 递归
    }
    return res
  } 
}

const get = createGetter() // 不是只读是深的
const shallowGet = createGetter(false, true) // 不是只读，浅的
const readonlyGet = createGetter(true) // 只读，深的
const shallowReadonlyGet = createGetter(true, true) // 只读，浅的

function createSetter(shallow= false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key]
    const hasKey = Object.prototype.hasOwnProperty.call(target, key)
    const res = Reflect.set(target, key, value, receiver)
    if (!hasKey) {
      // trigger(target, 'add', key, value)
    } else if (oldValue !== value) {
      // trigger(target, 'set', key, value)
    }
    return res
  }
}

const set = createSetter() //

const shallowSet = createSetter(true)

export const reactiveHandlers = {
  get,
  set
}

export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}

const readonlyObj = {
  set: (target, key) => {
    console.warn(`set on key ${key} falied`)
  }
}

export const readonlyHandlers = extend({
  get: readonlyGet,
}, readonlyObj)

export const shallowReadonlyHandlers = extend({
  get: shallowReadonlyGet,
}, readonlyObj)
