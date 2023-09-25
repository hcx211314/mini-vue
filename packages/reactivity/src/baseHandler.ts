import { isObject, isArray, isIntegerKey, extend, hasOwn } from '@vue/shared';
import { readonly, reactive } from './index'
import { track, trigger } from './effect'
import { TrackOpType } from './operations'


export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      // 收集依赖，等数据变化后更新视图
      // 收集effect
      track(target, TrackOpType.GET, key)
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

function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    // 注意： 1. 是对象还是数组 2. 添加值 还是修改 proxy
    const oldValue = target[key]
    const hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
    // const hasKey = Object.prototype.hasOwnProperty.call(target, key)
    const res = Reflect.set(target, key, value, receiver)
    if (!hasKey) {
      // 新增
      trigger(target, 'add', key, value)
    } else if (oldValue !== value) {
      // 修改
      trigger(target, 'set', key, value)
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
