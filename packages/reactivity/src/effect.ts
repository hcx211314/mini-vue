import { isObject, isArray, isIntegerKey, extend, hasOwn, hasChange } from '@vue/shared';
import { TrackOpType, TriggerOpType } from './operations'

export function effect(fn, options: any = {}) {
  const effect = createReactEffect(fn, options)
  if (!options.lazy) {
    effect() // 默认执行
  }
  return effect
}

let uid = 0
let activeEffect // 保存当前的effect
const effectStack = []
function createReactEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) { // 保证effect没有加入到栈中，用于处理a.name++
      try {
        // 入栈
        effectStack.push(effect)
        activeEffect = effect
        fn() // 执行用户传入的方法
      } finally {
        effectStack.pop()
        activeEffect = effectStack.at(-1)
      }
    }
  }
  effect.id = uid++; // 区别effect
  effect._isEffect = true // 区别effect 是不是响应的effect
  effect.raw = fn; // 保存用户的方法
  effect.options = options // 保存用户的属性
  return effect
}


let targetMap = new WeakMap()
// 收集effect 在获取数据的时候，触发get，触发
export function track(target, type, key) {
  // map =》 key =》 target =》 属性 =》 【effect】 set
  // console.log(target, type, key, activeEffect)
  // key和我们的effect一一对应
  if (activeEffect === undefined) {
    // 没有在effect中使用
    return
  }

  // 1. 获取effect {terget: 值（map）}
  let depMap = targetMap.get(target)
  if (!depMap) {
    // 没有则添加值
    targetMap.set(target, (depMap = new Map()))
  }
  let dep = depMap.get(key)
  if (!dep) {
    depMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
}


export function trigger(target, type, key?, newValue?, oldValue?) {
  const depMap = targetMap.get(target)
  if (!depMap) {
    return // 没有effect
  }
  let effectSet = new Set() // 如果有多个同时修改一个值，并且相同，set可以做到去重
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => { effectSet.add(effect) })
    }
  }
  // 处理数组
  if (key === 'length' && isArray(target)) {
    depMap.forEach((dep, key) => {
      if (key === 'length' || key > newValue) {
        add(dep)
      }
    })
  } else {
    // 可能是对象
    if (key !== undefined) {
      add(depMap.get(key))
    }
    // 数组通过索引修改
    switch (type) {
      case TriggerOpType.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          add(depMap.get('length'))
        }
    }
  }

  effectSet.forEach((effect: any) => {
    effect()
  })
}
