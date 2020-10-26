import Post from './dummy/models/Post'
import User from './dummy/models/User'
import Comment from './dummy/models/Comment'
import { Model } from '../src'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Posts as postsResponse } from './dummy/data/posts'
import { Posts as postsEmbedResponse } from './dummy/data/postsEmbed'
import { Post as postResponse } from './dummy/data/post'
import { Post as postEmbedResponse } from './dummy/data/postEmbed'
import { Comments as commentsResponse } from './dummy/data/comments'
import { Comments as commentsEmbedResponse } from './dummy/data/commentsEmbed'
import Tag from './dummy/models/Tag'

describe('Model methods', () => {

  let errorModel = {}
  Model.$http = axios
  let axiosMock = new MockAdapter(axios)

  beforeEach(() => {
    axiosMock.reset()
    Post.prototype['primaryKey'] = () => {
      return 'id'
    }
  })

  test('it throws a error when find() has no parameters', () => {
    errorModel = () => {
      const post = Post.find()
    }

    expect(errorModel).toThrow('You must specify the param on find() method.')
  })

  test('it throws a error when $find() has no parameters', () => {
    errorModel = () => {
      const post = Post.$find()
    }

    expect(errorModel).toThrow('You must specify the param on $find() method.')
  })

  test('first() returns first object in array as instance of such Model', async () => {

    axiosMock.onGet('http://localhost/posts').reply(200, {
      data: postsResponse
    })

    const post = await Post.first()
    expect(post).toEqual(postsResponse[0])
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach(tag => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('$first() returns first object in array as instance of such Model', async () => {

    axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

    const post = await Post.$first()

    expect(post).toEqual(postsEmbedResponse.data[0])
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach(tag => {
      expect(tag).toBeInstanceOf(Tag)
    })
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
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach(tag => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('$find() handles request with "data" wrapper', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postEmbedResponse)

    const post = await Post.$find(1)

    expect(post).toEqual(postEmbedResponse.data)
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.data.forEach(tag => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test('$find() handles request without "data" wrapper', async () => {
    axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)

    const post = await Post.$find(1)

    expect(post).toEqual(postResponse)
    expect(post).toBeInstanceOf(Post)
    expect(post.user).toBeInstanceOf(User)
    post.relationships.tags.forEach(tag => {
      expect(tag).toBeInstanceOf(Tag)
    })
  })

  test("find() method returns a object as instance of such Model with empty relationships", async () => {
    const _postResponse = postResponse;
    _postResponse.user = null;
    _postResponse.relationships.tags = [];

    axiosMock.onGet("http://localhost/posts/1").reply(200, _postResponse);

    const post = await Post.find(1);

    expect(post).toEqual(postResponse);
    expect(post).toBeInstanceOf(Post);
    expect(post.user).toStrictEqual(null);
    expect(post.relationships.tags).toStrictEqual([]);
  });

  test("find() method returns a object as instance of such Model with some empty relationships", async () => {
    const _postResponse = postResponse;
    _postResponse.user = null;

    axiosMock.onGet("http://localhost/posts/1").reply(200, _postResponse);

    const post = await Post.find(1);

    expect(post).toEqual(postResponse);
    expect(post).toBeInstanceOf(Post);
    expect(post.user).toStrictEqual(null);

    post.relationships.tags.forEach((tag) => {
      expect(tag).toBeInstanceOf(Tag);
    });
  });

  test('get() method returns a array of objects as instance of suchModel', async () => {
    axiosMock.onGet('http://localhost/posts').reply(200, postsResponse)

    const posts = await Post.get()

    posts.forEach(post => {
      expect(post).toBeInstanceOf(Post)
      expect(post.user).toBeInstanceOf(User)
      post.relationships.tags.forEach(tag => {
        expect(tag).toBeInstanceOf(Tag)
      })
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

    comments.forEach(comment => {
      expect(comment).toBeInstanceOf(Comment)
      comment.replies.forEach(reply => {
        expect(reply).toBeInstanceOf(Comment)
      })
    })
  })

  test('get() hits right resource (nested object, custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    let post = new Post({ id: 1, someId: 'po996-9dd18' })

    axiosMock.onGet().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}/comments`)

      return [200, commentsResponse]
    })

    const comments = await post.comments().get()

    comments.forEach(comment => {
      expect(comment).toBeInstanceOf(Comment)
      comment.replies.forEach(reply => {
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
    axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse.data)

    const posts = await Post.$get()

    expect(posts).toEqual(postsEmbedResponse.data)

  })

  test('$get() hits right resource with "data" wrapper (nested object)', async () => {
    axiosMock.onGet().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/posts/1/comments')

      return [200, commentsEmbedResponse]
    })

    const post = new Post({ id: 1 })
    const comments = await post.comments().$get()

    comments.forEach(comment => {
      expect(comment).toBeInstanceOf(Comment)
      comment.replies.data.forEach(reply => {
        expect(reply).toBeInstanceOf(Comment)
      })
    })
  })

  test('$get() hits right resource (nested object, custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    let post = new Post({ id: 1, someId: 'po996-9dd18' })

    axiosMock.onGet().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}/comments`)

      return [200, commentsResponse]
    })

    const comments = await post.comments().$get()

    comments.forEach(comment => {
      expect(comment).toBeInstanceOf(Comment)
      comment.replies.forEach(reply => {
        expect(reply).toBeInstanceOf(Comment)
      })
    })
  })

  test('save() method makes a POST request when ID of object does not exists', async () => {
    let post
    const _postResponse = {
      id: 1,
      title: 'Cool!',
      text: 'Lorem Ipsum Dolor',
      user: {
        firstname: 'John',
        lastname: 'Doe',
        age: 25
      },
      relationships: {
        tags: [
          {
            name: 'super'
          },
          {
            name: 'awesome'
          }
        ]
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
    post.relationships.tags.forEach(tag => {
      expect(tag).toBeInstanceOf(Tag)
    })
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

  test('save() method makes a PUT request when ID of object exists (custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    let post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}`)
      expect(config.data).toEqual(JSON.stringify(post))

      return [200, {}]
    })

    await post.save()
  })

  test('save() method makes a PUT request when ID of object exists (nested object)', async () => {
    let comment

    axiosMock.onGet('http://localhost/posts/1/comments').reply(200, commentsResponse)

    axiosMock.onPut().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual('http://localhost/posts/1/comments/1')

      return [200, {}]
    })

    const post = new Post({ id: 1 })
    comment = await post.comments().first()
    comment.text = 'Owh!'
    comment.save()
  })

  test('save() method makes a PUT request when ID of object exists (nested object, customPK)', async () => {
    let comment, post

    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock.onGet(`http://localhost/posts/${post.someId}/comments`).reply(200, commentsResponse)

    axiosMock.onPut().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}/comments/1`)

      return [200, {}]
    })

    comment = await post.comments().first()
    comment.text = 'Owh!'
    comment.save()
  })

  test('save() method makes a POST request when ID of object is null', async () => {
    let post

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.data).toEqual(JSON.stringify(post))
      expect(config.url).toEqual('http://localhost/posts')

      return [200, {}]
    })

    post = new Post({ id: null, title: 'Cool!' })
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

  test('a request from delete() method hits the right resource (custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    let post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('delete')
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}`)

      return [200, {}]
    })

    await post.delete()
  })

  test('a request from delete() method when model has not ID throws a exception', async () => {

    errorModel = () => {
      let post = new Post()
      post.delete()
    }

    expect(errorModel).toThrow('This model has a empty ID.')
  })

  test('a request from delete() method hits the right resource (nested object)', async () => {
    axiosMock.onGet('http://localhost/posts/1/comments').reply(200, commentsResponse)

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
    let comment, post

    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    post = new Post({ id: 1, someId: 'xs911-8cf12', title: 'Cool!' })

    axiosMock.onGet(`http://localhost/posts/${post.someId}/comments`).reply(200, commentsResponse)

    axiosMock.onDelete().reply((config) => {
      expect(config.method).toEqual('delete')
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}/comments/1`)

      return [200, {}]
    })

    comment = await post.comments().first()
    comment.delete()
  })

  test('a request with custom() method hits the right resource', async () => {

    axiosMock.onAny().reply((config) => {
      expect(config.url).toEqual(`http://localhost/postz`)

      return [200, {}]
    })

    const post = await Post.custom('postz').first()
  })

  test('custom() gracefully handles accidental / for string arguments', async () => {

    axiosMock.onAny().reply((config) => {
      expect(config.url).toBe('http://localhost/postz/recent')

      return [200, {}]
    })

    const post = await Post.custom('/postz', 'recent').first()
  })

  test('custom() called with multiple objects/strings gets the correct resource', async () => {
    let user
    let comment

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/users/1/postz/comments')

      return [200, {}]
    })

    user = new User({ id: 1 })
    comment = new Comment()
    const result = await Comment.custom(user, 'postz', comment).get()
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

  test('a request from hasMany() with a find() hits right resource', async () => {
    let user
    let post

    axiosMock.onAny().reply((config) => {
      expect(config.method).toEqual('get')
      expect(config.url).toEqual('http://localhost/users/1/posts/1')
      return [200, {}]
    })

    user = new User({ id: 1 })
    post = await user.posts().find(1)
  })

  test('a request hasMany() method returns a array of Models', async () => {

    axiosMock.onGet('http://localhost/users/1/posts').reply(200, postsResponse)

    const user = new User({ id: 1 })
    const posts = await user.posts().get()

    posts.forEach(post => {
      expect(post).toBeInstanceOf(Post)
    })
  })

  test('attach() method hits right endpoint with a POST request', async () => {
    let comment

    axiosMock.onPost().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual('http://localhost/posts/1/comments')

      return [200, {}]
    })

    const post = new Post({ id: 1 })
    comment = { text: 'hi!' }
    let response = post.comments().attach(comment)
  })

  test('attach() method hits right endpoint with a POST request (custom PK)', async () => {
    Post.prototype['primaryKey'] = () => {
      return 'someId'
    }

    let comment, post

    post = new Post({ id: 1, someId: 'gt123-9gh23' })

    axiosMock.onAny().reply(config => {
      console.log(config)
    })

    axiosMock.onPost().reply((config) => {
      expect(config.method).toEqual('post')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual(`http://localhost/posts/${post.someId}/comments`)

      return [200, {}]
    })

    comment = { text: 'hi!' }
    post.comments().attach(comment)
  })

  test('sync() method hits right endpoint with a PUT request', async () => {
    let comment

    axiosMock.onPut().reply((config) => {
      expect(config.method).toEqual('put')
      expect(config.data).toEqual(JSON.stringify(comment))
      expect(config.url).toEqual('http://localhost/posts/1/comments')

      return [200, {}]
    })

    const post = new Post({ id: 1 })
    comment = { text: 'hi!' }
    let response = post.comments().sync(comment)
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

    expect(comment.endpoint()).toEqual(`http://localhost/users/${user.id}/posts/${post.id}/comments`)
  })

  test('it throws a error when for() method does not recieve a instance of Model', () => {
    errorModel = () => {
      const post = new Post({ text: 'Hello' }).for()
    }

    expect(errorModel).toThrow('The for() method takes a minimum of one argument.')

    errorModel = () => {
      const post = new Post({ text: 'Hello' }).for({})
    }

    expect(errorModel).toThrow('The object referenced on for() method is not a valid Model.')

    errorModel = () => {
      const post = new Post({ text: 'Hello' }).for('')
    }

    expect(errorModel).toThrow('The object referenced on for() method is not a valid Model.')

    errorModel = () => {
      const post = new Post({ text: 'Hello' }).for(1)
    }

    expect(errorModel).toThrow('The object referenced on for() method is not a valid Model.')
  })

  test('it throws a error when for() when referenced object has not a valid id', () => {
    errorModel = () => {
      const user = new User({ name: 'Mary' })
      const post = new Post({ text: 'Hello' }).for(user)
    }

    expect(errorModel).toThrow('The object referenced on for() method has a invalid id.')
  })

  test('it throws a error when a custom() parameter is not a valid Model or a string', () => {

    errorModel = () => {
      const post = new Post({ text: 'Hello' }).custom()
    }

    expect(errorModel).toThrow('The custom() method takes a minimum of one argument.')

    errorModel = () => {
      const user = new User({ name: 'Mary' })
      const post = new Post({ text: 'Hello' }).custom(user, 'a-string', 42)
    }

    expect(errorModel).toThrow('Arguments to custom() must be strings or instances of Model.')
  })

  test('save() method makes a PUT request to the correct URL on nested object thas was fetched with find() method', async () => {
    axiosMock.onGet('http://localhost/posts/1/comments/1').reply(200, commentsResponse[0])
    axiosMock.onPut('http://localhost/posts/1/comments/1').reply(200, commentsResponse[0])

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
