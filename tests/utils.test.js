import { getProp, serialize, setProp } from '../src/utils'

describe('Utilities', () => {
  const formDataAppend = global.FormData.prototype.append;

  beforeEach(() => {
    global.FormData.prototype.append = jest.fn(formDataAppend);
  });

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
    expect(Array.isArray(foo.x)).toBeTruthy()
  })

  test('[setProp]: Mutates; changes the value via array-type keys and add array with value in index "1"', () => {
    const foo = {}

    setProp(foo, ['x', '1', 'z'], 123)

    expect(foo).toEqual({ x: [undefined, { z: 123 }] })
    expect(Array.isArray(foo.x)).toBeTruthy()
  })

  test('[setProp]: Mutates; changes the value via array-type keys, but as "10.0" is float, it doesn\'t create an array', () => {
    const foo = {}

    setProp(foo, ['x', '10.0', 'z'], 123)

    expect(foo).toStrictEqual({ x: { '10.0': { z: 123 } } })
    expect(Array.isArray(foo.x)).toBeFalsy()
  })

  test('[setProp]: Mutates; changes the value via array-type keys, but as "10.2" is float, it doesn\'t create an array', () => {
    const foo = {}

    setProp(foo, ['x', '10.2', 'z'], 123)
    expect(foo).toStrictEqual({ x: { '10.2': { z: 123 } } })
    expect(Array.isArray(foo.x)).toBeFalsy()
  })

  test('[setProp]: Mutates; can create arrays when key is numeric', () => {
    const foo = { a: 1 }

    // Create arrays instead of objects
    setProp(foo, 'e.0.0', 2)

    expect(foo.e[0][0]).toStrictEqual(2)
    expect(foo).toStrictEqual({ a: 1, e: [[2]] })
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

    expect(error).toThrow('Cannot create property \'c\' on number \'123\'')

    expect(foo.a.b).toStrictEqual(123)
    expect(foo).toStrictEqual({ a: { b: 123 } })
  })

  test('[setProp]: Mutates; writes into existing object w/ array value', () => {
    const foo = { a: { b: { c: 123, d: { e: 5 } } } }

    // Preserve object tree, with array value
    setProp(foo, 'a.b.d.z', [1,2,3,4])

    expect(foo.a.b.d).toStrictEqual({ e: 5, z: [1, 2, 3, 4] })
  })

  /**
   * Tests of `serialize`
   * Based on tests from https://github.com/therealparmesh/object-to-formdata (MIT)
   */

  test('[serialize]: undefined', () => {
    const formData = serialize({
      foo: undefined,
    });

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
  });

  test('[serialize]: null', () => {
    const formData = serialize({
      foo: null,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', '');
    expect(formData.get('foo')).toBe('');
  });

  test('[serialize]: null with nullsAsUndefineds option', () => {
    const formData = serialize(
      {
        foo: null,
      },
      {
        nullsAsUndefineds: true,
      },
    );

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
  });

  test('[serialize]: boolean', () => {
    const formData = serialize({
      foo: true,
      bar: false,
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo', true);
    expect(formData.append).toHaveBeenNthCalledWith(2, 'bar', false);
    expect(formData.get('foo')).toBe('true');
    expect(formData.get('bar')).toBe('false');
  });

  test('[serialize]: boolean with booleansAsIntegers option', () => {
    const formData = serialize(
      {
        foo: true,
        bar: false,
      },
      {
        booleansAsIntegers: true,
      },
    );

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo', 1);
    expect(formData.append).toHaveBeenNthCalledWith(2, 'bar', 0);
    expect(formData.get('foo')).toBe('1');
    expect(formData.get('bar')).toBe('0');
  });

  test('[serialize]: integer', () => {
    const formData = serialize({
      foo: 1,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', 1);
    expect(formData.get('foo')).toBe('1');
  });

  test('[serialize]: float', () => {
    const formData = serialize({
      foo: 1.01,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', 1.01);
    expect(formData.get('foo')).toBe('1.01');
  });

  test('[serialize]: string', () => {
    const formData = serialize({
      foo: 'bar',
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', 'bar');
    expect(formData.get('foo')).toBe('bar');
  });

  test('[serialize]: empty string', () => {
    const formData = serialize({
      foo: '',
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', '');
    expect(formData.get('foo')).toBe('');
  });

  test('[serialize]: Object', () => {
    const formData = serialize({
      foo: {
        bar: 'baz',
        qux: 'quux',
      },
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[bar]', 'baz');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[qux]', 'quux');
    expect(formData.get('foo[bar]')).toBe('baz');
    expect(formData.get('foo[qux]')).toBe('quux');
  });

  test('[serialize]: empty Object', () => {
    const formData = serialize({
      foo: {},
    });

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
  });

  test('[serialize]: Object in Array', () => {
    const formData = serialize({
      foo: [
        {
          bar: 'baz',
        },
        {
          qux: 'quux',
        },
      ],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[][bar]', 'baz');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[][qux]', 'quux');
    expect(formData.get('foo[][bar]')).toBe('baz');
    expect(formData.get('foo[][qux]')).toBe('quux');
  });

  test('[serialize]: Object in Object', () => {
    const formData = serialize({
      foo: {
        bar: {
          baz: {
            qux: 'quux',
          },
        },
      },
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo[bar][baz][qux]', 'quux');
    expect(formData.get('foo[bar][baz][qux]')).toBe('quux');
  });

  test('[serialize]: Array', () => {
    const formData = serialize({
      foo: ['bar', 'baz'],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[]', 'baz');
    expect(formData.getAll('foo[]')).toEqual(['bar', 'baz']);
  });

  test('[serialize]: empty Array', () => {
    const formData = serialize({
      foo: [],
    });

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
  });

  test('[serialize]: Array in Array', () => {
    const formData = serialize({
      foo: [[['bar', 'baz']]],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[][][]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[][][]', 'baz');
    expect(formData.getAll('foo[][][]')).toEqual(['bar', 'baz']);
  });

  test('[serialize]: Array in Object', () => {
    const formData = serialize({
      foo: {
        bar: ['baz', 'qux'],
      },
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[bar][]', 'baz');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[bar][]', 'qux');
    expect(formData.getAll('foo[bar][]')).toEqual(['baz', 'qux']);
  });

  test('[serialize]: Array where key ends with "[]"', () => {
    const formData = serialize({
      'foo[]': ['bar', 'baz'],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[]', 'baz');
    expect(formData.getAll('foo[]')).toEqual(['bar', 'baz']);
  });

  test('[serialize]: Array with indices option', () => {
    const formData = serialize(
      {
        foo: ['bar', 'baz'],
      },
      {
        indices: true,
      },
    );

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[0]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[1]', 'baz');
    expect(formData.get('foo[0]')).toBe('bar');
    expect(formData.get('foo[1]')).toBe('baz');
  });

  test('[serialize]: Array with allowEmptyArrays option', () => {
    const formData = serialize(
      {
        foo: [],
      },
      {
        allowEmptyArrays: true,
      },
    );

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', '');
    expect(formData.get('foo[]')).toBe('');
  });

  test('[serialize]: Date', () => {
    const foo = new Date(2000, 0, 1, 1, 1, 1);
    const formData = serialize({
      foo,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', foo.toISOString());
    expect(formData.get('foo')).toBe(foo.toISOString());
  });

  test('[serialize]: File', () => {
    const foo = new File([], '');
    const formData = serialize({
      foo,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', foo);
    expect(formData.get('foo')).toBe(foo);
  });

})
