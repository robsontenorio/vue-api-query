import { getProp, setProp } from '../src/utils'

describe('Utilities', () => {
  /**
   * Tests of `getProp`
   * Based on tests from https://github.com/dy/dotprop (MIT)
   */

  test('[getProp]: Get property defined by dot notation in string.', () => {
    const holder = {
      a: {
        b: {
          c: 1
        }
      }
    }

    const result = getProp(holder, 'a.b.c')

    expect(result).toBe(1)
  })

  test('[getProp]: Get property defined by array-type keys.', () => {
    const holder = {
      a: {
        b: {
          c: 1
        }
      }
    }

    const result = getProp(holder, ['a', 'b', 'c'])

    expect(result).toBe(1)
  })

  test('[getProp]: Get property defined by simple string.', () => {
    const holder = {
      a: {
        b: {
          c: 1
        }
      }
    }

    const result = getProp(holder, 'a')

    expect(result).toBe(holder.a)
  })

  test('[getProp]: Get holder when propName is not defined.', () => {
    const holder = {
      a: {
        b: {
          c: 1
        }
      }
    }

    // @ts-ignore
    const result = getProp(holder)

    expect(result).toBe(holder)
  })

  test('[getProp]: Get empty object when holder is not defined.', () => {
    // @ts-ignore
    const result = getProp()

    expect(result).toStrictEqual({})
  })

  /**
   * Tests of `setProp`
   * Based on tests from https://github.com/lukeed/dset (MIT)
   */

  test('[setProp]: Does not return output', () => {
    const foo = { a: 1, b: 2 }
    const out = setProp(foo, 'c', 3)

    expect(out).toBeUndefined()
  })

  test('[setProp]: Mutates; adds simple key:val', () => {
    const foo = { a: 1, b: 2 }
    setProp(foo, 'c', 3)

    expect(foo).toStrictEqual({ a: 1, b: 2, c: 3 })
  })

  test('[setProp]: Mutates; adds deeply nested key:val', () => {
    const foo = {}

    // Add deep
    setProp(foo, 'a.b.c', 999)

    expect(foo).toStrictEqual({ a: { b: { c: 999 } } })
  })

  test('[setProp]: Mutates; changes the value via array-type keys', () => {
    const foo = {}

    // Add deep
    setProp(foo, ['a', 'b', 'c'], 123)

    expect(foo).toStrictEqual({ a: { b: { c: 123 } } })
  })

  test('[setProp]: Mutates; changes the value via array-type keys and add array with value in index "0"', () => {
    const foo = {}

    setProp(foo, ['x', '0', 'z'], 123)

    expect(foo).toStrictEqual({ x: [{ z: 123 }] })
    // @ts-ignore
    expect(Array.isArray(foo.x)).toBeTruthy()
  })

  test('[setProp]: Mutates; changes the value via array-type keys and add array with value in index "1"', () => {
    const foo = {}

    setProp(foo, ['x', '1', 'z'], 123)

    expect(foo).toEqual({ x: [undefined, { z: 123 }] })
    // @ts-ignore
    expect(Array.isArray(foo.x)).toBeTruthy()
  })

  test('[setProp]: Mutates; changes the value via array-type keys, but as "10.0" is float, it doesn\'t create an array', () => {
    const foo = {}

    setProp(foo, ['x', '10.0', 'z'], 123)

    expect(foo).toStrictEqual({ x: { '10.0': { z: 123 } } })
    // @ts-ignore
    expect(Array.isArray(foo.x)).toBeFalsy()
  })

  test('[setProp]: Mutates; changes the value via array-type keys, but as "10.2" is float, it doesn\'t create an array', () => {
    const foo = {}

    setProp(foo, ['x', '10.2', 'z'], 123)
    expect(foo).toStrictEqual({ x: { '10.2': { z: 123 } } })
    // @ts-ignore
    expect(Array.isArray(foo.x)).toBeFalsy()
  })

  test('[setProp]: Mutates; can create arrays when key is numeric', () => {
    const foo = { a: 1 }

    // Create arrays instead of objects
    setProp(foo, 'e.0.0', 2)

    // @ts-ignore
    expect(foo.e[0][0]).toStrictEqual(2)
    expect(foo).toStrictEqual({ a: 1, e: [[2]] })
    // @ts-ignore
    expect(Array.isArray(foo.e)).toBeTruthy()
  })

  test('[setProp]: Mutates; writes into/preserves existing object', () => {
    const foo = { a: { b: { c: 123 } } }

    // Preserve existing structure
    setProp(foo, 'a.b.x.y', 456)

    expect(foo).toStrictEqual({ a: { b: { c: 123, x: { y: 456 } } } })
  })

  test('[setProp]: Refuses to convert existing non-object value into object', () => {
    const foo = { a: { b: 123 } }
    const error = () => {
      // Preserve non-object value, won't alter
      setProp(foo, 'a.b.c', 'hello')
    }

    expect(error).toThrow("Cannot create property 'c' on number '123'")

    expect(foo.a.b).toStrictEqual(123)
    expect(foo).toStrictEqual({ a: { b: 123 } })
  })

  test('[setProp]: Mutates; writes into existing object w/ array value', () => {
    const foo = { a: { b: { c: 123, d: { e: 5 } } } }

    // Preserve object tree, with array value
    setProp(foo, 'a.b.d.z', [1, 2, 3, 4])

    expect(foo.a.b.d).toStrictEqual({ e: 5, z: [1, 2, 3, 4] })
  })
})
