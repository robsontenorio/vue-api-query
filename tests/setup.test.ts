import EmptyBaseModel from './dummy/models/EmptyBaseModel'

import Post from './dummy/models/Post'

describe('Setup models', () => {
  let errorModel = {}

  test('it throws an error if $http property has not been set', () => {
    EmptyBaseModel.reset().withBaseURL().withRequest()

    errorModel = () => {
      // @ts-ignore
      new EmptyBaseModel()
    }

    expect(errorModel).toThrow('You must set $http property')
  })

  test('it throws an error if baseURL() method was not declared', () => {
    EmptyBaseModel.reset().withRequest().withHttp()

    errorModel = () => {
      // @ts-ignore
      new EmptyBaseModel()
    }
    expect(errorModel).toThrow('You must declare baseURL() method.')
  })

  test('it throws an error if request() method was not declared', () => {
    EmptyBaseModel.reset().withBaseURL().withHttp()

    errorModel = () => {
      // @ts-ignore
      new EmptyBaseModel()
    }
    expect(errorModel).toThrow('You must declare request() method.')
  })

  test('the resource() method pluralizes the class name', () => {
    const post = new Post()
    expect(post.resource()).toEqual('posts')
  })

  test('the resource() method can be overrided', () => {
    Post.prototype['resource'] = () => {
      return 'postz'
    }

    const post = new Post()

    expect(post.resource()).toEqual('postz')

    // @ts-ignore
    delete Post.prototype['resource']
  })

  test('the primaryKey() method can be overrided', () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post()

    expect(post.primaryKey()).toEqual('someId')

    // @ts-ignore
    delete Post.prototype['primaryKey']
  })

  test('the baseURL() method can be overrided', () => {
    Post.prototype['baseURL'] = () => {
      return 'http://api.com'
    }

    const post = new Post()

    expect(post.baseURL()).toEqual('http://api.com')

    // @ts-ignore
    delete Post.prototype['baseURL']
  })
})
