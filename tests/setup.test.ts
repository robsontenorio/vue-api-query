import EmptyBaseModel from './dummy/models/EmptyBaseModel'
import Post from './dummy/models/Post'

describe('Setup Models', () => {
  let errorModel = {}

  test('Should throw an error if $http property has not been set', () => {
    EmptyBaseModel.reset().withBaseURL().withRequest()

    errorModel = () => {
      // @ts-ignore
      new EmptyBaseModel()
    }

    expect(errorModel).toThrow('You must set $http property')
  })

  test('Should throw an error if baseURL() method was not declared', () => {
    EmptyBaseModel.reset().withRequest().withHttp()

    errorModel = () => {
      // @ts-ignore
      new EmptyBaseModel()
    }

    expect(errorModel).toThrow('You must declare baseURL() method.')
  })

  test('Should throw an error if request() method was not declared', () => {
    EmptyBaseModel.reset().withBaseURL().withHttp()

    errorModel = () => {
      // @ts-ignore
      new EmptyBaseModel()
    }

    expect(errorModel).toThrow('You must declare request() method.')
  })

  test('The resource() method should pluralizes the class name', () => {
    const post = new Post()
    expect(post.resource()).toEqual('posts')
  })

  test('The resource() method can be overridden', () => {
    Post.prototype['resource'] = () => {
      return 'postz'
    }

    const post = new Post()

    expect(post.resource()).toEqual('postz')

    // @ts-ignore
    delete Post.prototype['resource']
  })

  test('The primaryKey() method can be overridden', () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post()

    expect(post.primaryKey()).toEqual('someId')

    // @ts-ignore
    delete Post.prototype['primaryKey']
  })

  test('The baseURL() method can be overridden', () => {
    Post.prototype['baseURL'] = () => {
      return 'http://api.com'
    }

    const post = new Post()

    expect(post.baseURL()).toEqual('http://api.com')

    // @ts-ignore
    delete Post.prototype['baseURL']
  })
})
