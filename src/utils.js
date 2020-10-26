/**
 * Get property defined by dot notation in string.
 * Based on https://github.com/dy/dotprop (MIT)
 *
 * @param  {Object} holder   Target object where to look property up
 * @param  {string | string[]} propName Dot notation, like 'this.a.b.c'
 * @return {*}          A property value
 */
export function getProp (holder, propName) {
  if (!propName || !holder) {
    return holder || {}
  }

  if (propName in holder) {
    return holder[propName]
  }

  const propParts = Array.isArray(propName) ? propName : (propName + '').split('.')

  let result = holder
  while (propParts.length && result) {
    result = result[propParts.shift()]
  }

  return result
}

/**
 * Set property defined by dot notation in string.
 * Based on https://github.com/lukeed/dset (MIT)
 *
 * @param  {Object} holder   Target object where to look property up
 * @param  {string | string[]} propName Dot notation, like 'this.a.b.c'
 * @param  {*}      value    The value to be set
 */
export function setProp (holder, propName, value) {
  const propParts = Array.isArray(propName) ? propName : (propName + '').split('.')
  let i = 0, l = propParts.length, t = holder, x

  for (; i < l; ++i) {
    x = t[propParts[i]]
    t = t[propParts[i]] = (i === l - 1 ? value : (x != null ? x : (!!~propParts[i + 1].indexOf('.') || !(+propParts[i + 1] > -1)) ? {} : []))
  }
}
