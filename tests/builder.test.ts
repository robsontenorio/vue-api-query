import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Model from '../src/Model'
import { Post as postResponse } from './dummy/data/post'
import ModelWithParamNames from './dummy/models/ModelWithParamNames'
import Post from './dummy/models/Post'
import User from './dummy/models/User'

describe('Query builder', () => {
  const errorModel = {}
  Model.$http = axios
  const axiosMock = new MockAdapter(axios)

  beforeEach(() => {
    axiosMock.reset()
  })

  test('it throws an error when trying to use Query Builder methods after fetching data', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)
    const errorMessage =
      'Builder methods are not available after fetching data.'
    const post = await Post.find(1)

    // @ts-ignore
    const includeError = () => post.include()
    // @ts-ignore
    const appendError = () => post.append()
    // @ts-ignore
    const selectError = () => post.select()
    // @ts-ignore
    const whereError = () => post.where()
    // @ts-ignore
    const whereInError = () => post.whereIn()
    // @ts-ignore
    const orderByError = () => post.orderBy()
    // @ts-ignore
    const pageError = () => post.page()
    // @ts-ignore
    const limitError = () => post.limit()
    // @ts-ignore
    const paramsError = () => post.params()
    // @ts-ignore
    const getError = () => post.get()
    // @ts-ignore
    const findError = () => post.find(2)

    expect(includeError).toThrow(errorMessage)
    expect(appendError).toThrow(errorMessage)
    expect(selectError).toThrow(errorMessage)
    expect(whereError).toThrow(errorMessage)
    expect(whereInError).toThrow(errorMessage)
    expect(orderByError).toThrow(errorMessage)
    expect(pageError).toThrow(errorMessage)
    expect(limitError).toThrow(errorMessage)
    expect(paramsError).toThrow(errorMessage)
    expect(getError).toThrow(errorMessage)
    expect(findError).toThrow(errorMessage)
  })

  test('it builds a complex query', () => {
    const post = Post.include('user')
      .append('likes')
      .select({
        posts: ['title', 'content'],
        user: ['age', 'firstname']
      })
      .where('title', 'Cool')
      .where('status', 'ACTIVE')
      .page(3)
      .limit(10)
      .orderBy('created_at')
      .params({
        doSomething: 'yes',
        process: 'no'
      })

    const query =
      '?include=user&append=likes&fields[posts]=title,content&fields[user]=age,firstname&filter[title]=Cool&filter[status]=ACTIVE&sort=created_at&page=3&limit=10&doSomething=yes&process=no'

    // @ts-ignore
    expect(post._builder.query()).toEqual(query)
  })

  test('it builds a complex query with custom param names', () => {
    const post = ModelWithParamNames.include('user')
      .append('likes')
      .select({
        posts: ['title', 'content'],
        user: ['age', 'firstname']
      })
      .where('title', 'Cool')
      .where('status', 'ACTIVE')
      .page(3)
      .limit(10)
      .orderBy('created_at')

    const query =
      '?include_custom=user&append_custom=likes&fields_custom[posts]=title,content&fields_custom[user]=age,firstname&filter_custom[title]=Cool&filter_custom[status]=ACTIVE&sort_custom=created_at&page_custom=3&limit_custom=10'

    // @ts-ignore
    expect(post._builder.query()).toEqual(query)
  })

  test('include() sets properly the builder', () => {
    let post = Post.include('user')

    // @ts-ignore
    expect(post._builder.includes).toEqual(['user'])

    post = Post.include('user', 'category')

    // @ts-ignore
    expect(post._builder.includes).toEqual(['user', 'category'])
  })

  test('append() sets properly the builder', () => {
    let post = Post.append('likes')

    // @ts-ignore
    expect(post._builder.appends).toEqual(['likes'])

    post = Post.append('likes', 'visits')

    // @ts-ignore
    expect(post._builder.appends).toEqual(['likes', 'visits'])
  })

  test('orderBy() sets properly the builder', () => {
    let post = Post.orderBy('created_at')

    // @ts-ignore
    expect(post._builder.sorts).toEqual(['created_at'])

    post = Post.orderBy('created_at', '-visits')

    // @ts-ignore
    expect(post._builder.sorts).toEqual(['created_at', '-visits'])
  })

  test('where() sets properly the builder', () => {
    let post = Post.where('id', 1)

    // @ts-ignore
    expect(post._builder.filters).toEqual({ id: 1 })

    post = Post.where('id', 1).where('title', 'Cool')

    // @ts-ignore
    expect(post._builder.filters).toEqual({ id: 1, title: 'Cool' })
  })

  test('where() throws a exception when doest not have params or only first param', () => {
    let errorModel = () => {
      // @ts-ignore
      const post = Post.where()
    }

    expect(errorModel).toThrow(
      'The KEY and VALUE are required on where() method.'
    )

    errorModel = () => {
      // @ts-ignore
      const post = Post.where('id')
    }

    expect(errorModel).toThrow(
      'The KEY and VALUE are required on where() method.'
    )
  })

  test('where() throws a exception when second parameter is not primitive', () => {
    const errorModel = () => {
      const post = Post.where('id', ['foo'])
    }

    expect(errorModel).toThrow('The VALUE must be primitive on where() method.')
  })

  test('whereIn() sets properly the builder', () => {
    const post = Post.whereIn('status', ['ACTIVE', 'ARCHIVED'])

    // @ts-ignore
    expect(post._builder.filters).toEqual({ status: 'ACTIVE,ARCHIVED' })
  })

  test('whereIn() throws a exception when second parameter is not a array', () => {
    const errorModel = () => {
      // @ts-ignore
      const post = Post.whereIn('id', 'foo')
    }

    expect(errorModel).toThrow(
      'The second argument on whereIn() method must be an array.'
    )
  })

  test('page() sets properly the builder', () => {
    const post = Post.page(3)

    // @ts-ignore
    expect(post._builder.pageValue).toEqual(3)
  })

  test('page() throws a exception when value is not a number', () => {
    const errorModel = () => {
      // @ts-ignore
      const post = Post.page('foo')
    }

    expect(errorModel).toThrow('The VALUE must be an integer on page() method.')
  })

  test('limit() sets properly the builder', () => {
    const post = Post.limit(10)

    // @ts-ignore
    expect(post._builder.limitValue).toEqual(10)
  })

  test('limit() throws a exception when value is not a number', () => {
    const errorModel = () => {
      // @ts-ignore
      const post = Post.limit('foo')
    }

    expect(errorModel).toThrow(
      'The VALUE must be an integer on limit() method.'
    )
  })

  test('select() with no parameters', () => {
    const errorModel = () => {
      const post = Post.select()
    }

    expect(errorModel).toThrow(
      'You must specify the fields on select() method.'
    )
  })

  test('select() for single entity', () => {
    const user = User.select('age', 'firstname')

    // @ts-ignore
    expect(user._builder.fields.users).toEqual('age,firstname')
  })

  test('select() for related entities', () => {
    const post = Post.select({
      posts: ['title', 'content'],
      user: ['age', 'firstname']
    })

    // @ts-ignore
    expect(post._builder.fields.posts).toEqual('title,content')
    // @ts-ignore
    expect(post._builder.fields.user).toEqual('age,firstname')
  })

  test('params() sets properly the builder', () => {
    const post = Post.params({ doSomething: 'yes' })

    // @ts-ignore
    expect(post._builder.payload).toEqual({ doSomething: 'yes' })
  })

  test('params() throws a exception when the payload is not an object', () => {
    const errorModel = () => {
      // @ts-ignore
      const post = Post.params()
    }

    expect(errorModel).toThrow('You must pass a payload/object as param.')
  })

  test('it resets the uri upon query generation when the query is regenerated a second time', () => {
    const post = Post.where('title', 'Cool').page(4)

    const query = '?filter[title]=Cool&page=4'

    // @ts-ignore
    expect(post._builder.query()).toEqual(query)
    // @ts-ignore
    expect(post._builder.query()).toEqual(query)
  })
})
