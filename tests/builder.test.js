
import Post from './dummy/models/Post'
import { Model } from '../src'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';

describe('Query builder', () => {

  let errorModel = {}
  Model.$http = axios
  let axiosMock = new MockAdapter(axios)

  beforeEach(() => {
    axiosMock.reset()
  })

  test('it builds a complex query', () => {
    const post = Post
      .where('title', 'Cool')
      .where('status', 'ACTIVE')
      .include('user')
      .append('likes')
      .page(3)
      .limit(10)
      .orderBy('created_at')

    const query = encodeURI('?include=user&filter[title]=Cool&filter[status]=ACTIVE&append=likes&sort=created_at&page=3&limit=10')

    expect(post._builder.query()).toEqual(query)
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

  test('where() sets properly the builder', () => {
    let post = Post.where('id', 1)

    expect(post._builder.filters.filter).toEqual({ id: 1 })

    post = Post.where('id', 1).where('title', 'Cool')

    expect(post._builder.filters.filter).toEqual({ id: 1, title: 'Cool' })
  })

  test('where() throws a exception when doest not have params or only first param', () => {
    let errorModel = () => {
      const post = Post.where()
    }

    expect(errorModel).toThrow('The KEY and VALUE are required on where() method.')

    errorModel = () => {
      const post = Post.where('id')
    }

    expect(errorModel).toThrow('The KEY and VALUE are required on where() method.')
  })

  test('where() throws a exception when second parameter is not primitive', () => {
    let errorModel = () => {
      const post = Post.where('id', ['foo'])
    }

    expect(errorModel).toThrow('The VALUE must be primitive on where() method.')
  })

  test('whereIn() sets properly the builder', () => {
    let post = Post.whereIn('status', ['ACTIVE', 'ARCHIVED'])

    expect(post._builder.filters.filter).toEqual({ status: 'ACTIVE,ARCHIVED' })
  })

  test('whereIn() throws a exception when second parameter is not a array', () => {
    let errorModel = () => {
      const post = Post.whereIn('id', 'foo')
    }

    expect(errorModel).toThrow('The second argument on whereIn() method must be an array.')
  })


  test('page() sets properly the builder', () => {
    let post = Post.page(3)

    expect(post._builder.pageValue).toEqual(3)
  })

  test('page() throws a exception when value is not a number', () => {
    let errorModel = () => {
      const post = Post.page('foo')
    }

    expect(errorModel).toThrow('The VALUE must be an integer on page() method.')
  })

  test('limit() sets properly the builder', () => {
    let post = Post.limit(10)

    expect(post._builder.limitValue).toEqual(10)
  })

  test('limit() throws a exception when value is not a number', () => {
    let errorModel = () => {
      const post = Post.limit('foo')
    }

    expect(errorModel).toThrow('The VALUE must be an integer on limit() method.')
  })

})