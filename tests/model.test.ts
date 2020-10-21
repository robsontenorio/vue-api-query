import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Model from '../src/Model'
import { Comments as commentsResponse } from './dummy/data/comments'
import { Comments as commentsEmbedResponse } from './dummy/data/commentsEmbed'
import { Post as postResponse } from './dummy/data/post'
import { Post as postEmbedResponse } from './dummy/data/postEmbed'
import { Posts as postsResponse } from './dummy/data/posts'
import { Posts as postsAllEmbedResponse } from './dummy/data/postsAllEmbed'
import { Posts as postsEmbedResponse } from './dummy/data/postsEmbed'
import Comment from './dummy/models/Comment'
import CommentWrapped from './dummy/models/CommentWrapped'
import Post from './dummy/models/Post'
import PostAllEmbed from './dummy/models/PostAllEmbed'
import PostCollectionEmbed from './dummy/models/PostCollectionEmbed'
import PostCommentEmbed from './dummy/models/PostCommentEmbed'
import PostEmbed from './dummy/models/PostEmbed'
import Tag from './dummy/models/Tag'
import TagEmbed from './dummy/models/TagEmbed'
import User from './dummy/models/User'

describe('Model methods', () => {
  let errorModel = {}
  Model.$http = axios
  const axiosMock = new MockAdapter(axios)

  beforeEach(() => {
    axiosMock.reset()
    Post.prototype['primaryKey'] = () => {
      return 'id'
    }
  })

  test('it throws an error when trying to use Query Builder methods after fetching data', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)
    const post = await Post.find(1)

    errorModel = () => {
      // @ts-ignore
      post.find(2)
    }

    expect(errorModel).toThrow(
      'Builder methods are not available after fetching data.'
    )
  })

  test('it throws a error when find() has no parameters', () => {
    errorModel = () => {
      // @ts-ignore
      Post.find()
    }

    expect(errorModel).toThrow('You must specify the param on find() method.')
  })

  test('it throws a error when $find() has no parameters', () => {
    errorModel = () => {
      // @ts-ignore
      Post.$find()
    }

    expect(errorModel).toThrow('You must specify the param on $find() method.')
  })

  test('first() returns first object in array as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsResponse)

    const post = await Post.first()

    expect(post).toEqual(postsResponse[0])
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach((tag) => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('first() returns first object in array with "data" wrapper as instance of such Model wrapped with "data"', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsAllEmbedResponse)

    const { data: post } = await PostAllEmbed.first()

    expect(post).toEqual(postsAllEmbedResponse.data[0].data)
    expect(post).toBeInstanceOf(PostAllEmbed)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.data.forEach((tag) => {
      expect(tag).toBeInstanceOf(TagEmbed)
    })
  })

  test('$first() returns first object in array as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsResponse)

    const post = await Post.$first()

    expect(post).toEqual(postsResponse[0])
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach((tag) => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('$first() returns first object in array with "data" wrapper as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

    const post = await PostCollectionEmbed.$first()

    expect(post).toEqual(postsEmbedResponse.data[0])
    expect(post).toBeInstanceOf(PostCollectionEmbed)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.data.forEach((tag) => {
      expect(tag).toBeInstanceOf(TagEmbed)
    })
  })

  test('$first() returns first object in array with "data" wrapper as instance of such Model wrapped with "data"', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsAllEmbedResponse)

    const post = await PostAllEmbed.$first()

    expect(post).toEqual(postsAllEmbedResponse.data[0].data)
    expect(post).toBeInstanceOf(PostAllEmbed)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.data.forEach((tag) => {
      expect(tag).toBeInstanceOf(TagEmbed)
    })
  })

  test('first() method returns a empty object when no items have found', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, [])

    const post = await Post.first()
    expect(post).toEqual({})
  })

  test('find() method returns an object as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)

    const post = await Post.find(1)
    expect(post).toEqual(postResponse)
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach((tag) => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('find() method returns an object as instance of such Model wrapped with "data"', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postEmbedResponse)

    const { data: post } = await PostEmbed.find(1)

    expect(post).toEqual(postEmbedResponse.data)
    expect(post).toBeInstanceOf(PostEmbed)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach((tag) => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('$find() handles request with "data" wrapper', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postEmbedResponse)

    const post = await PostEmbed.$find(1)

    expect(post).toEqual(postEmbedResponse.data)
    expect(post).toBeInstanceOf(PostEmbed)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach((tag) => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('$find() handles request without "data" wrapper', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)

    const post = await Post.$find(1)

    expect(post).toEqual(postResponse)
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach((tag) => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('get() method returns an array of objects as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsResponse)

    const posts = await Post.get()

    posts.forEach((post) => {
      expect(post).toBeInstanceOf(Post)
      expect(post.user).toBeInstanceOf(User)
      post.relationships.tags.forEach((tag) => {
        expect(tag).toBeInstanceOf(Tag)
      })
    })
  })

  test('get() method returns an object with "data" wrapper containing an array of objects as instance of such Model wrapped with "data"', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

    const { data: posts } = await PostCollectionEmbed.get()

    posts.forEach((post) => {
      expect(post).toBeInstanceOf(PostCollectionEmbed)
      expect(post.user).toBeInstanceOf(User)
    })
  })

  test('get() method returns an object with "data" wrapper containing an array of objects as instance of such Model', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsAllEmbedResponse)

    const { data: posts } = await PostAllEmbed.get()

    posts.forEach(({ data: post }) => {
      expect(post).toBeInstanceOf(PostAllEmbed)
      expect(post.user).toBeInstanceOf(User)
    })
  })

  test('get() hits right resource (nested object)', async () => {
    axiosMock.onGet().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/posts/1/comments')

      return [200, commentsResponse]
    })

    const post = new Post({ id: 1 })
    const comments = await post.comments().get()

    comments.forEach((comment) => {
      expect(comment).toBeInstanceOf(Comment)
      comment.replies.forEach((reply) => {
        expect(reply).toBeInstanceOf(Comment)
      })
    })
  })

  test('get() hits right resource (nested object, custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post({ id: 1, someId: 'po996-9dd18' })

    axiosMock.onGet().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual(
        `http://localhost/posts/${post.someId}/comments`
      )

      return [200, commentsResponse]
    })

    const comments = await post.comments().get()

    comments.forEach((comment) => {
      expect(comment).toBeInstanceOf(Comment)
      comment.replies.forEach((reply) => {
        expect(reply).toBeInstanceOf(Comment)
      })
    })
  })

  test('$get() fetch style request with "data" wrapper', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

    const posts = await Post.$get()

    expect(posts).toEqual(postsEmbedResponse.data)
  })

  test('$get() fetch style request without "data" wrapper', async () => {
    axiosMock
      .onGet('http://localhost/posts')
      .reply(200, postsEmbedResponse.data)

    const posts = await Post.$get()

    expect(posts).toEqual(postsEmbedResponse.data)
  })

  test('$get() hits right resource with "data" wrapper (nested object)', async () => {
    axiosMock.onGet().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/posts/1/comments')

      return [200, commentsEmbedResponse]
    })

    const post = new PostCommentEmbed({ id: 1 })
    const comments = await post.comments().$get()

    comments.forEach((comment) => {
      expect(comment).toBeInstanceOf(CommentWrapped)
      comment.replies.data.forEach((reply) => {
        expect(reply).toBeInstanceOf(CommentWrapped)
      })
    })
  })

  test('$get() hits right resource (nested object, custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post({ id: 1, someId: 'po996-9dd18' })

    axiosMock.onGet().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual(
        `http://localhost/posts/${post.someId}/comments`
      )

      return [200, commentsResponse]
    })

    const comments = await post.comments().$get()

    comments.forEach((comment) => {
      expect(comment).toBeInstanceOf(Comment)
      comment.replies.forEach((reply) => {
        expect(reply).toBeInstanceOf(Comment)
      })
    })
  })

  test('save() method makes a POST request when ID of object does not exists', async () => {
    let post:
      | Post
      | Required<
          Pick<
            Post,
            | 'delete'
            | 'save'
            | 'attach'
            | 'sync'
            | 'for'
            | 'id'
            | 'someId'
            | 'text'
            | 'user'
            | 'relationships'
            | 'comments'
          >
        >
    const _postResponse = {
      id: 1,
      title: 'Cool!',
      text: 'Lorem Ipsum Dolor',
      user: {
        firstname: 'John',
        lastname: 'Doe',
        age: 25
      }
    }

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.data).toEqual(JSON.stringify(post))
      expect(config.url).toEqual('http://localhost/posts')

      return [200, _postResponse]
    })

    post = new Post({ title: 'Cool!' })
    post = await post.save()

    expect(post).toEqual(_postResponse)
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
  })

  test('save() method makes a PUT request when ID of object exists', async () => {
    const post = new Post({ id: 1, title: 'Cool!' })

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(post))
      expect(config.url).toEqual('http://localhost/posts/1')

      return [200, {}]
    })

    await post.save()
  })

  test('save() method makes a PUT request when ID of object exists (custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}`)
      expect(config.data).toEqual(JSON.stringify(post))

      return [200, {}]
    })

    await post.save()
  })

  test('save() method makes a PUT request when ID of object exists (nested object)', async () => {
    // eslint-disable-next-line prefer-const
    let comment: Required<Pick<
      Comment,
      | 'delete'
      | 'save'
      | 'attach'
      | 'sync'
      | 'for'
      | 'id'
      | 'post_id'
      | 'someId'
      | 'text'
      | 'replies'
    >>

    axiosMock
      .onGet('http://localhost/posts/1/comments')
      .reply(200, commentsResponse)

    axiosMock.onPut().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual('http://localhost/posts/1/comments/1')

      return [200, {}]
    })

    const post = new Post({ id: 1 })
    comment = await post.comments().first()
    comment.text = 'Owh!'
    await comment.save()
  })

  test('save() method makes a PUT request when ID of object exists (nested object, customPK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    // eslint-disable-next-line prefer-const
    let comment: Required<Pick<
      Comment,
      | 'delete'
      | 'save'
      | 'attach'
      | 'sync'
      | 'for'
      | 'id'
      | 'post_id'
      | 'someId'
      | 'text'
      | 'replies'
    >>
    const post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock
      .onGet(`http://localhost/posts/${post.someId}/comments`)
      .reply(200, commentsResponse)

    axiosMock.onPut().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual(
        `http://localhost/posts/${post.someId}/comments/1`
      )

      return [200, {}]
    })

    comment = await post.comments().first()
    comment.text = 'Owh!'
    await comment.save()
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

  test('a request from delete() method hits the right resource (custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('delete')
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}`)

      return [200, {}]
    })

    await post.delete()
  })

  test('a request from delete() method when model has not ID throws a exception', async () => {
    errorModel = () => {
      const post = new Post()
      post.delete()
    }

    expect(errorModel).toThrow('This model has a empty ID.')
  })

  test('a request from delete() method hits the right resource (nested object)', async () => {
    axiosMock
      .onGet('http://localhost/posts/1/comments')
      .reply(200, commentsResponse)

    axiosMock.onDelete().reply((config) => {
      expect(config.method).toEqual('delete')
      expect(config.url).toBe('http://localhost/posts/1/comments/1')

      return [200, {}]
    })

    const post = new Post({ id: 1 })
    const comment = await post.comments().first()
    comment.delete()
  })

  test('a request from delete() method hits the right resource (nested object) (nested object, customPK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock
      .onGet(`http://localhost/posts/${post.someId}/comments`)
      .reply(200, commentsResponse)

    axiosMock.onDelete().reply((config) => {
      expect(config.method).toEqual('delete')
      expect(config.url).toEqual(
        `http://localhost/posts/${post.someId}/comments/1`
      )

      return [200, {}]
    })

    const comment = await post.comments().first()
    comment.delete()
  })

  test('a request with custom() method hits the right resource', async () => {
    axiosMock.onAny().reply((config) => {
      expect(config.url).toEqual(`http://localhost/postz`)

      return [200, {}]
    })

    await Post.custom('postz').first()
  })

  test('custom() gracefully handles accidental / for string arguments', async () => {
    axiosMock.onAny().reply((config) => {
      expect(config.url).toBe('http://localhost/postz/recent')

      return [200, {}]
    })

    await Post.custom('/postz', 'recent').first()
  })

  test('custom() called with multiple objects/strings gets the correct resource', async () => {
    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/users/1/postz/comments')

      return [200, {}]
    })

    const user = new User({ id: 1 })
    const comment = new Comment()
    await Comment.custom(user, 'postz', comment).get()
  })

  test('a request from hasMany() method hits right resource', async () => {
    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/users/1/posts')

      return [200, {}]
    })

    const user = new User({ id: 1 })
    await user.posts().get()
  })

  test('a request from hasMany() with a find() hits right resource', async () => {
    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/users/1/posts/1')
      return [200, {}]
    })

    const user = new User({ id: 1 })
    await user.posts().find(1)
  })

  test('a request hasMany() method returns an array of Models', async () => {
    axiosMock.onGet('http://localhost/users/1/posts').reply(200, postsResponse)

    const user = new User({ id: 1 })
    const posts = await user.posts().get()

    posts.forEach((post) => {
      expect(post).toBeInstanceOf(Post)
    })
  })

  test('attach() method hits right endpoint with a POST request', async () => {
    const post = new Post({ id: 1 })
    const comment = { text: 'hi!' }
    post.comments().attach(comment)

    axiosMock.onPost().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual('http://localhost/posts/1/comments')

      return [200, {}]
    })
  })

  test('attach() method hits right endpoint with a POST request (custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    const post = new Post({ id: 1, someId: 'gt123-9gh23' })
    const comment = { text: 'hi!' }
    post.comments().attach(comment)

    axiosMock.onPost().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual(
        `http://localhost/posts/${post.someId}/comments`
      )

      return [200, {}]
    })
  })

  test('sync() method hits right endpoint with a PUT request', async () => {
    const post = new Post({ id: 1 })
    const comment = { text: 'hi!' }
    post.comments().sync(comment)

    axiosMock.onPut().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual('http://localhost/posts/1/comments')

      return [200, {}]
    })
  })

  test('for() method setup the right resource', async () => {
    axiosMock.onPost().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.url).toEqual('http://localhost/users/1/posts')

      return [200, {}]
    })

    const user = new User({ id: 1 })
    const post = new Post({ text: 'Hello' }).for(user)
    await post.save()
  })

  test('Calling for() with multiple arguments productes the correct URL', () => {
    const user = new User({ id: 1 })
    const post = new Post({ id: 2 })
    const comment = new Comment({
      post_id: 2,
      text: 'for() takes more than one argument now!'
    }).for(user, post)

    expect(comment.endpoint()).toEqual(
      `http://localhost/users/${user.id}/posts/${post.id}/comments`
    )
  })

  test('it throws a error when for() method does not recieve a instance of Model', () => {
    errorModel = () => {
      new Post({ text: 'Hello' }).for()
    }

    expect(errorModel).toThrow(
      'The for() method takes a minimum of one argument.'
    )

    errorModel = () => {
      new Post({ text: 'Hello' }).for({})
    }

    expect(errorModel).toThrow(
      'The object referenced on for() method is not a valid Model.'
    )

    errorModel = () => {
      new Post({ text: 'Hello' }).for('')
    }

    expect(errorModel).toThrow(
      'The object referenced on for() method is not a valid Model.'
    )

    errorModel = () => {
      new Post({ text: 'Hello' }).for(1)
    }

    expect(errorModel).toThrow(
      'The object referenced on for() method is not a valid Model.'
    )
  })

  test('it throws a error when for() when referenced object has not a valid id', () => {
    errorModel = () => {
      const user = new User({ name: 'Mary' })
      new Post({ text: 'Hello' }).for(user)
    }

    expect(errorModel).toThrow(
      'The object referenced on for() method has a invalid id.'
    )
  })

  test('it throws a error when a custom() parameter is not a valid Model or a string', () => {
    errorModel = () => {
      new Post({ text: 'Hello' }).custom()
    }

    expect(errorModel).toThrow(
      'The custom() method takes a minimum of one argument.'
    )

    errorModel = () => {
      const user = new User({ name: 'Mary' })
      new Post({ text: 'Hello' }).custom(user, 'a-string', 42)
    }

    expect(errorModel).toThrow(
      'Arguments to custom() must be strings or instances of Model.'
    )
  })

  test('save() method makes a PUT request to the correct URL on nested object thas was fetched with find() method', async () => {
    axiosMock
      .onGet('http://localhost/posts/1/comments/1')
      .reply(200, commentsResponse[0])
    axiosMock
      .onPut('http://localhost/posts/1/comments/1')
      .reply(200, commentsResponse[0])

    const post = new Post({ id: 1 })
    const comment = await post.comments().find(1)

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.url).toEqual('http://localhost/posts/1/comments/1')

      return [200, {}]
    })

    comment.text = 'Hola!'
    await comment.save()
  })
})
