/**
 * Get property defined by dot notation in string.
 *
 * Based on {@link https://github.com/dy/dotprop } (MIT)
 *
 * @param  {Object} holder - Target object where to look property up.
 * @param  {string | string[]} propName - Dot notation, like `'a.b.c'` or `['a', 'b', 'c']`.
 * @return {*} - A property value.
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
 *
 * Based on {@link https://github.com/lukeed/dset} (MIT)
 *
 * @param  {Object} holder - Target object where to look property up.
 * @param  {string | string[]} propName - Dot notation, like `'a.b.c'` or `['a', 'b', 'c']`.
 * @param  {*} value - The value to be set.
 */
export function setProp (holder, propName, value) {
  const propParts = Array.isArray(propName) ? propName : (propName + '').split('.')
  let i = 0, l = propParts.length, t = holder, x

  for (; i < l; ++i) {
    x = t[propParts[i]]
    t = t[propParts[i]] = (i === l - 1 ? value : (x != null ? x : (!!~propParts[i + 1].indexOf('.') || !(+propParts[i + 1] > -1)) ? {} : []))
  }
}

/**
 * Convenient JavaScript function that serializes Objects to FormData instances.
 *
 * Based on {@link https://github.com/therealparmesh/object-to-formdata} (MIT)
 *
 * @param  {Object} obj - Target object
 * @param  {Object} [cfg] - Options
 * @param  {FormData} [fd] - Existing FormData
 * @param  {string} [pre] - keyPrefix
 */
export function serialize (obj, cfg, fd, pre) {
  cfg = cfg || {};

  cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;

  cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds)
    ? false
    : cfg.nullsAsUndefineds;

  cfg.booleansAsIntegers = isUndefined(cfg.booleansAsIntegers)
    ? false
    : cfg.booleansAsIntegers;

  cfg.allowEmptyArrays = isUndefined(cfg.allowEmptyArrays)
    ? false
    : cfg.allowEmptyArrays;

  fd = fd || new FormData();

  if (isUndefined(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, '');
    }
  } else if (isBoolean(obj)) {
    if (cfg.booleansAsIntegers) {
      fd.append(pre, obj ? 1 : 0);
    } else {
      fd.append(pre, obj);
    }
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        const key = pre + '[' + (cfg.indices ? index : '') + ']';

        serialize(value, cfg, fd, key);
      });
    } else if (cfg.allowEmptyArrays) {
      fd.append(pre + '[]', '');
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    Object.keys(obj).forEach((prop) => {
      const value = obj[prop];

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }

      const key = pre ? pre + '[' + prop + ']' : prop;

      serialize(value, cfg, fd, key);
    });
  } else {
    fd.append(pre, obj);
  }

  return fd;
}

const isUndefined = (value) => value === undefined

const isNull = (value) => value === null

const isBoolean = (value) => typeof value === 'boolean'

const isObject = (value) => value === Object(value)

const isArray = (value) => Array.isArray(value)

const isDate = (value) => value instanceof Date

const isBlob = (value) =>
  value &&
  typeof value.size === 'number' &&
  typeof value.type === 'string' &&
  typeof value.slice === 'function';

const isFile = (value) =>
  isBlob(value) &&
  typeof value.name === 'string' &&
  (typeof value.lastModifiedDate === 'object' ||
    typeof value.lastModified === 'number')
