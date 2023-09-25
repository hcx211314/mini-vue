export const isObject = (value) => {
  return value !== null && typeof value === 'object';
}

export const extend = Object.assign

export const isArray = Array.isArray

export const isFunction = (val) => typeof val === 'function'

export const isString = (val) => typeof val === 'string'

export const isNumber = (val) => typeof val === 'number'

export const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (
  val: Object,
  key: string|symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const isIntegerKey = (key: unknown) => 
  isString(key) && 
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt((key as string), 10) === key

  export const hasChange = (value, oldValue) => value !== oldValue