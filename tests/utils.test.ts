import { getProp, setProp } from '../src/utils'

describe('Utilities', () => {
  test('Get property defined by dot notation in string.', () => {
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

  test('Get property defined by simple string.', () => {
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

  test('Get holder if propName is not defined.', () => {
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

  test('Get empty object if holder is not defined.', () => {
    // @ts-ignore
    const result = getProp()

    expect(result).toStrictEqual({})
  })

  test('Set property defined by dot notation in string.', () => {
    const holder = {
      a: {
        b: {
          c: 1
        }
      }
    }

    setProp(holder, 'a.b.c', 2)

    const result = getProp(holder, 'a.b.c')

    expect(result).toBe(2)
  })

  test('Set property defined by simple string.', () => {
    const holder = {
      a: {
        b: {
          c: 1
        }
      }
    }

    setProp(holder, 'a', 2)

    const result = getProp(holder, 'a')

    expect(result).toBe(2)
  })
})
