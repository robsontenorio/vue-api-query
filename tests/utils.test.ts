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
})
