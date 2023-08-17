import { isObject } from '@vue/shared';
import { reactiveHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandler';

export function reactive(target) {
  return createReactiveObject(target, false, reactiveHandlers)
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers)
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)
}

//数据结构
const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()

// 核心实现代理
function createReactiveObject(target, isReadonly, baseHandlers) {
  // 先判断是不是对象
  if (!isObject(target)) {
    return
  }

  // 如果已经代理过了，就不要再次代理了
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  const existProxy = proxyMap.get(target)
  if (existProxy) {
    return existProxy
  }
  const proxy = new Proxy(target, baseHandlers)
  // 进行缓存代理
  proxyMap.set(target, proxy)
  return proxy
}