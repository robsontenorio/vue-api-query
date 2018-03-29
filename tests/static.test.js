
import Post from './dummy/models/Post'
import { Model } from '../src'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';

describe('Static calls', () => {

  let errorModel = {}
  Model.$http = axios
  let axiosMock = new MockAdapter(axios)

  beforeEach(() => {
    axiosMock.reset()
  })

  test('include() sets properly the builder', () => {
    let post = Post.include('user')

    expect(post._builder.includes).toEqual(['user'])

    post = Post.include('user', 'category')

    expect(post._builder.includes).toEqual(['user', 'category'])
  })

  test('append() sets properly the builder', () => {
    let post = Post.append('likes')

    expect(post._builder.appends).toEqual(['likes'])

    post = Post.append('likes', 'visits')

    expect(post._builder.appends).toEqual(['likes', 'visits'])
  })

  test('orderBy() sets properly the builder', () => {
    let post = Post.orderBy('created_at')

    expect(post._builder.sorts).toEqual(['created_at'])

    post = Post.orderBy('created_at', '-visits')

    expect(post._builder.sorts).toEqual(['created_at', '-visits'])
  })
})