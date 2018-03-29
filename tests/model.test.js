import qs from 'qs'
import Post from './dummy/models/Post'

describe('Model methods', () => {

  let errorModel = {}

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

  test('filters, include, append and orderBy are optionals', () => {
    const post = Post.whereIn('foo', [])

    const query = encodeURI('?filter[foo]=')

    expect(post._builder.query()).toEqual(query)
  })
})