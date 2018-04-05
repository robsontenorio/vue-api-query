import Post from './dummy/models/Post'
import User from './dummy/models/User'
import { Model } from '../src'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';
import { Posts as postsArrayResponse } from './dummy/data/array'
import { Posts as postsArrayEmbedResponse } from './dummy/data/arrayEmbed'
import { Post as postResponse } from './dummy/data/single'

describe('Model methods', () => {

  let errorModel = {}
  Model.$http = axios
  let axiosMock = new MockAdapter(axios)

  beforeEach(() => {
    axiosMock.reset()
  })

  test('it throws a error when find() has no parameters', () => {
    errorModel = () => {
      const post = Post.find()
    }

    expect(errorModel).toThrow('You must specify the param on find() method.')
  })

  test('first() returns first object in array as instance of such Model', async () => {

    axiosMock.onGet('http://localhost/posts').reply(200, {
      data: postsArrayResponse
    })

    const post = await Post.first()
    expect(post).toEqual(postsArrayResponse[0])
    expect(post).toBeInstanceOf(Post)
  })

  test('first() method returns a empty object when no items have found', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, [])

    const post = await Post.first()
    expect(post).toEqual({})
  })

  test('find() method returns a object as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)

    const post = await Post.find(1)
    expect(post).toEqual(postResponse)
    expect(post).toBeInstanceOf(Post)
  })

  test('get() method returns a array of objects as instace of suchModel', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsArrayResponse)

    const posts = await Post.get()

    posts.forEach(post => {
      expect(post).toBeInstanceOf(Post)
    });
  })

  test('$get() fetch style request with "data" attribute', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsArrayEmbedResponse)

    const posts = await Post.$get()

    expect(posts).toEqual(postsArrayEmbedResponse.data)

  })

  test('$get() fetch style request without "data" attribute', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsArrayEmbedResponse.data)

    const posts = await Post.$get()

    expect(posts).toEqual(postsArrayEmbedResponse.data)

  })

  test('save() method makes a POST request when ID of object does not exists', async () => {
    let post

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.data).toEqual(JSON.stringify(post))
      expect(config.url).toEqual('http://localhost/posts')

      return [200, {}]
    })

    post = new Post({ title: 'Cool!' })
    await post.save()

  })

  test('save() method makes a PUT request when ID of object exists', async () => {

    let post

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(post))
      expect(config.url).toEqual('http://localhost/posts/1')

      return [200, {}]
    })

    post = new Post({ id: 1, title: 'Cool!' })
    await post.save()
  })

  test('a request from delete() method hits the right resource', async () => {

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('delete')
      expect(config.url).toBe('http://localhost/posts/1')

      return [200, {}]
    })

    const post = new Post({ id: 1 })

    post.delete()
  })

  test('a request from delete() method when model has not ID throws a exception', async () => {

    errorModel = () => {
      let post = new Post()
      post.delete()
    }

    expect(errorModel).toThrow('This model has a empty ID.')
  })

  test('a request with custom() method hits the right resource', async () => {

    axiosMock.onAny().reply((config) => {
      expect(config.url).toBe('postz')

      return [200, {}]
    })

    const post = await Post.custom('postz').first()
  })

  test('a request from hasMany() method hits right resource', async () => {
    let user
    let posts

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/users/1/posts')

      return [200, {}]
    })

    user = new User({ id: 1 })
    posts = await user.posts().get()
  })

  test('a request hasMany() method returns a array of Models', async () => {

    axiosMock.onGet('http://localhost/users/1/posts').reply(200, postsArrayResponse)

    const user = new User({ id: 1 })
    const posts = await user.posts().get()

    posts.forEach(post => {
      expect(post).toBeInstanceOf(Post)
    });
  })
})