import Post from './dummy/models/Post'

describe('Model methods', () => {

  let errorModel = {}

  test('it throws a error when find() has no parameters', () => {
    errorModel = () => {
      const post = Post.find()
    }

    expect(errorModel).toThrow('The "id" must be a integer on find() method.')
  })
})