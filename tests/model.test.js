import qs from 'qs'
import Post from './dummy/models/Post'
import { Model } from '../src'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';
import { Posts as postsArrayResponse } from './dummy/data/array'
import { Post as postResponse } from './dummy/data/single'

describe('Model methods', () => {

  let errorModel = {}
  Model.$http = axios
  let axiosMock = new MockAdapter(axios)

  test('it throws a error when find() has no parameters', () => {
    errorModel = () => {
      const post = Post.find()
    }

    expect(errorModel).toThrow('The "id" must be a integer on find() method.')
  })

  test('it builds a complexy query', () => {
    const post = Post
      .where('title', 'Cool')
      .where('status', 'ACTIVE')
      .include('user')
      .append('likes')
      .orderBy('created_at')

    const query = encodeURI('?include=user&filter[title]=Cool&filter[status]=ACTIVE&append=likes&sort=created_at')

    expect(post._builder.query()).toEqual(query)

  })

  test('first() returns first object in array as instance of such Model', async () => {

    axiosMock.onGet('http://localhost/posts').reply(200, {
      data: postsArrayResponse
    })

    const post = await Post.first()
    expect(post).toEqual(postsArrayResponse[0])
    expect(post).toBeInstanceOf(Post)
  })

  test('find() returns a object as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)

    const post = await Post.find(1)
    expect(post).toEqual(postResponse)
    // expect(post).toBeInstanceOf(Post)
  })

  test('get() method returns a array of objects as instace of suchModel', async () => {

  })

})