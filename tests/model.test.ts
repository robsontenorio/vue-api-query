import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Model from '../src/Model'
import { QueryResponseCollection, QueryResponseModel } from '../src/types'
import { Comments as commentsResponse } from './dummy/data/comments'
import { Comments as commentsEmbedResponse } from './dummy/data/commentsEmbed'
import { Post as postResponse } from './dummy/data/post'
import { Post as postEmbedResponse } from './dummy/data/postEmbed'
import { Posts as postsResponse } from './dummy/data/posts'
import { Posts as postsAllEmbedResponse } from './dummy/data/postsAllEmbed'
import { Posts as postsEmbedResponse } from './dummy/data/postsEmbed'
import Comment from './dummy/models/Comment'
import CommentWrapped from './dummy/models/CommentWrapped'
import EmptyBaseModel from './dummy/models/EmptyBaseModel'
import Post from './dummy/models/Post'
import PostAllEmbed from './dummy/models/PostAllEmbed'
import PostCollectionEmbed from './dummy/models/PostCollectionEmbed'
import PostCommentEmbed from './dummy/models/PostCommentEmbed'
import PostEmbed from './dummy/models/PostEmbed'
import Tag from './dummy/models/Tag'
import TagEmbed from './dummy/models/TagEmbed'
import User from './dummy/models/User'

describe('Model Class', () => {
  let errorModel = {}
  Model.$http = axios
  const axiosMock = new MockAdapter(axios)

  beforeEach(() => {
    axiosMock.reset()
    Post.prototype['primaryKey'] = () => {
      return 'id'
    }
  })

  describe('Setup', () => {
    test('Should throw an error if baseURL() is not defined', () => {
      // @ts-ignore
      EmptyBaseModel.prototype.baseURL = undefined

      errorModel = () => {
        // @ts-ignore
        new EmptyBaseModel()
      }

      expect(errorModel).toThrow('You must declare baseURL() method.')
    })

    test('Should throw an error if request() is not defined', () => {
      EmptyBaseModel.prototype.baseURL = () => ''
      // @ts-ignore
      EmptyBaseModel.prototype.request = undefined

      errorModel = () => {
        // @ts-ignore
        new EmptyBaseModel()
      }

      expect(errorModel).toThrow('You must declare request() method.')
    })

    test('Should throw an error if $http is not defined', () => {
      EmptyBaseModel.prototype.baseURL = () => ''
      // @ts-ignore
      EmptyBaseModel.prototype.request = () => ''
      // @ts-ignore
      Model.$http = undefined

      errorModel = () => {
        // @ts-ignore
        new EmptyBaseModel()
      }

      expect(errorModel).toThrow('You must set $http property.')

      Model.$http = axios
    })
  })

  describe('Query Builder', () => {
    describe('first()', () => {
      test('Should return the first Model of a Collection of Models', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, postsResponse)

        const post = (await Post.first()) as QueryResponseModel<Post, false>

        expect(post).toEqual(postsResponse[0])
        expect(post).toBeInstanceOf(Post)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.forEach((tag) => {
          expect(tag).toBeInstanceOf(Tag)
        })
      })

      test('Should return the first Model of a Collection of Models, handling the Collection wrapped in "data"', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

        const post = (await PostCollectionEmbed.first()) as QueryResponseModel<
          PostCollectionEmbed
        >

        expect(post).toEqual(postsEmbedResponse.data[0])
        expect(post).toBeInstanceOf(PostCollectionEmbed)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.data.forEach((tag) => {
          expect(tag).toBeInstanceOf(TagEmbed)
        })
      })

      test('Should return the first Model of a Collection of Models, handling Collection and Models wrapped in "data"', async () => {
        axiosMock
          .onGet('http://localhost/posts')
          .reply(200, postsAllEmbedResponse)

        const {
          data: post
        } = (await PostAllEmbed.first()) as QueryResponseModel<
          PostAllEmbed,
          true
        >

        expect(post).toEqual(postsAllEmbedResponse.data[0].data)
        expect(post).toBeInstanceOf(PostAllEmbed)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.data.forEach((tag) => {
          expect(tag).toBeInstanceOf(TagEmbed)
        })
      })

      test('Should return an empty object when no items have found', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, [])

        const post = await Post.first()
        expect(post).toEqual({})
      })
    })

    describe('$first()', () => {
      test('Should return the first Model of a Collection of Models', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, postsResponse)

        const post = await Post.$first()

        expect(post).toEqual(postsResponse[0])
        expect(post).toBeInstanceOf(Post)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.forEach((tag) => {
          expect(tag).toBeInstanceOf(Tag)
        })
      })

      test('Should return the first Model of a Collection of Models, handling the Collection wrapped in "data"', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

        const post = await PostCollectionEmbed.$first()

        expect(post).toEqual(postsEmbedResponse.data[0])
        expect(post).toBeInstanceOf(PostCollectionEmbed)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.data.forEach((tag) => {
          expect(tag).toBeInstanceOf(TagEmbed)
        })
      })

      test('Should return the first Model of a Collection of Models, handling Collection and Models wrapped in "data"', async () => {
        axiosMock
          .onGet('http://localhost/posts')
          .reply(200, postsAllEmbedResponse)

        const post = await PostAllEmbed.$first()

        expect(post).toEqual(postsAllEmbedResponse.data[0].data)
        expect(post).toBeInstanceOf(PostAllEmbed)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.data.forEach((tag) => {
          expect(tag).toBeInstanceOf(TagEmbed)
        })
      })

      test('Should return an empty object when no items have found', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, [])

        const post = await Post.$first()
        expect(post).toEqual({})
      })
    })

    describe('find()', () => {
      test('Should throw an error when has no parameters', () => {
        errorModel = () => {
          // @ts-ignore
          Post.find()
        }

        expect(errorModel).toThrow(
          'You must specify the param on find() method.'
        )
      })

      test('Should return a Model', async () => {
        axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)

        const post = (await Post.find(1)) as QueryResponseModel<Post, false>
        expect(post).toEqual(postResponse)
        expect(post).toBeInstanceOf(Post)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.forEach((tag) => {
          expect(tag).toBeInstanceOf(Tag)
        })
      })

      test('Should return a Model, handling the "data" wrapper', async () => {
        axiosMock
          .onGet('http://localhost/posts/1')
          .reply(200, postEmbedResponse)

        const { data: post } = (await PostEmbed.find(1)) as QueryResponseModel<
          PostEmbed,
          true
        >

        expect(post).toEqual(postEmbedResponse.data)
        expect(post).toBeInstanceOf(PostEmbed)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.forEach((tag) => {
          expect(tag).toBeInstanceOf(Tag)
        })
      })
    })

    describe('$find()', () => {
      test('Should throw an error when has no parameters', () => {
        errorModel = () => {
          // @ts-ignore
          Post.$find()
        }

        expect(errorModel).toThrow(
          'You must specify the param on $find() method.'
        )
      })

      test('Should return a Model, handling the "data" wrapper', async () => {
        axiosMock
          .onGet('http://localhost/posts/1')
          .reply(200, postEmbedResponse)

        const post = await PostEmbed.$find(1)

        expect(post).toEqual(postEmbedResponse.data)
        expect(post).toBeInstanceOf(PostEmbed)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.forEach((tag) => {
          expect(tag).toBeInstanceOf(Tag)
        })
      })

      test('Should return a Model, without the "data" wrapper', async () => {
        axiosMock.onGet('http://localhost/posts/1').reply(200, postResponse)

        const post = await Post.$find(1)

        expect(post).toEqual(postResponse)
        expect(post).toBeInstanceOf(Post)
        expect(post.user).toBeInstanceOf(User)
        post.relationships.tags.forEach((tag) => {
          expect(tag).toBeInstanceOf(Tag)
        })
      })
    })

    describe('get()', () => {
      test('Should return a Collection of Models', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, postsResponse)

        const posts = (await Post.get()) as QueryResponseCollection<
          Post,
          false,
          false
        >

        posts.forEach((post) => {
          expect(post).toBeInstanceOf(Post)
          expect(post.user).toBeInstanceOf(User)
          post.relationships.tags.forEach((tag) => {
            expect(tag).toBeInstanceOf(Tag)
          })
        })
      })

      test('Should return a Collection of Models, handling the Collection wrapped in "data"', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

        const {
          data: posts
        } = (await PostCollectionEmbed.get()) as QueryResponseCollection<
          PostCollectionEmbed,
          true,
          false
        >

        posts.forEach((post) => {
          expect(post).toBeInstanceOf(PostCollectionEmbed)
          expect(post.user).toBeInstanceOf(User)
        })
      })

      test('Should return a Collection of Models, handling Collection and Models wrapped in "data"', async () => {
        axiosMock
          .onGet('http://localhost/posts')
          .reply(200, postsAllEmbedResponse)

        const {
          data: posts
        } = (await PostAllEmbed.get()) as QueryResponseCollection<
          PostAllEmbed,
          true,
          true
        >

        posts.forEach(({ data: post }) => {
          expect(post).toBeInstanceOf(PostAllEmbed)
          expect(post.user).toBeInstanceOf(User)
        })
      })

      test('Should return a Collection of Models of a Lazy Relationship', async () => {
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

      test('Should return a Collection of Models of a Lazy Relationship, with a custom Primary Key', async () => {
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
    })

    describe('$get()', () => {
      test('Should return a Collection of Models, handling the "data" wrapper', async () => {
        axiosMock.onGet('http://localhost/posts').reply(200, postsEmbedResponse)

        const posts = await Post.$get()

        expect(posts).toEqual(postsEmbedResponse.data)
      })

      test('Should return a Collection of Models, without the "data" wrapper', async () => {
        axiosMock
          .onGet('http://localhost/posts')
          .reply(200, postsEmbedResponse.data)

        const posts = await Post.$get()

        expect(posts).toEqual(postsEmbedResponse.data)
      })

      test('Should return a Collection of Models of a Lazy Relationship, handling the "data" wrapper', async () => {
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

      test('Should return a Collection of Models of a Lazy Relationship, handling the "data" wrapper, with a custom Primary Key', async () => {
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
    })

    describe('custom()', () => {
      test('Should throw an error when a parameter is not a valid Model or a string', () => {
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

      test('Should hit the right resource', async () => {
        axiosMock.onAny().reply((config) => {
          expect(config.url).toEqual(`http://localhost/postz`)

          return [200, {}]
        })

        await Post.custom('postz').first()
      })

      test('Should gracefully handle accidental / for string arguments', async () => {
        axiosMock.onAny().reply((config) => {
          expect(config.url).toBe('http://localhost/postz/recent')

          return [200, {}]
        })

        await Post.custom('/postz', 'recent').first()
      })

      test('Should get the correct resource when called with multiple objects/strings', async () => {
        axiosMock.onAny().reply((config) => {
          expect(config.method).toEqual('get')
          expect(config.url).toEqual('http://localhost/users/1/postz/comments')

          return [200, {}]
        })

        const user = new User({ id: 1 })
        const comment = new Comment()
        await Comment.custom(user, 'postz', comment).get()
      })
    })
  })

  describe('CRUD Operations', () => {
    describe('save()', () => {
      test('Should make a POST request when ID of object does not exists', async () => {
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

      test('Should make a POST request when ID of object does not exists and return a Model wrapped with "data"', async () => {
        let post:
          | PostEmbed
          | {
              data: Required<
                Pick<
                  PostEmbed,
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
            }
        const _postResponse = {
          data: {
            id: 1,
            title: 'Cool!',
            text: 'Lorem Ipsum Dolor',
            user: {
              firstname: 'John',
              lastname: 'Doe',
              age: 25
            }
          }
        }

        axiosMock.onAny().reply((config) => {
          expect(config.method).toEqual('post')
          expect(config.data).toEqual(JSON.stringify(post))
          expect(config.url).toEqual('http://localhost/posts')

          return [200, _postResponse]
        })

        post = new PostEmbed({ title: 'Cool!' })
        post = await post.save()

        expect(post.data).toEqual(_postResponse.data)
        expect(post.data).toBeInstanceOf(PostEmbed)
        expect(post.data.user).toBeInstanceOf(User)
      })

      test('Should make a POST request when ID of object is null', async () => {
        const post = new Post({ id: null, title: 'Cool!' })

        axiosMock.onAny().reply((config) => {
          expect(config.method).toEqual('post')
          expect(config.data).toEqual(JSON.stringify(post))
          expect(config.url).toEqual('http://localhost/posts')

          return [200, {}]
        })

        await post.save()
      })

      test('Should make a PUT request when ID of object exists', async () => {
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
          expect(config.method).toEqual('put')
          expect(config.data).toEqual(JSON.stringify(post))
          expect(config.url).toEqual('http://localhost/posts/1')

          return [200, _postResponse]
        })

        post = new Post({ id: 1, title: 'Cool!' })
        post = await post.save()

        expect(post).toEqual(_postResponse)
        expect(post).toBeInstanceOf(Post)
        expect(post.user).toBeInstanceOf(User)
      })

      test('Should make a PUT request when ID of object exists and return a Model wrapped with "data"', async () => {
        let post:
          | PostEmbed
          | {
              data: Required<
                Pick<
                  PostEmbed,
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
            }
        const _postResponse = {
          data: {
            id: 1,
            title: 'Cool!',
            text: 'Lorem Ipsum Dolor',
            user: {
              firstname: 'John',
              lastname: 'Doe',
              age: 25
            }
          }
        }

        axiosMock.onAny().reply((config) => {
          expect(config.method).toEqual('put')
          expect(config.data).toEqual(JSON.stringify(post))
          expect(config.url).toEqual('http://localhost/posts/1')

          return [200, _postResponse]
        })

        post = new PostEmbed({ id: 1, title: 'Cool!' })
        post = await post.save()

        expect(post.data).toEqual(_postResponse.data)
        expect(post.data).toBeInstanceOf(PostEmbed)
        expect(post.data.user).toBeInstanceOf(User)
      })

      test('Should make a PUT request when ID of object exists, with a custom Primary Key', async () => {
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

      test('Should make a PUT request when ID of object exists for a Lazy Relationship', async () => {
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

      test('Should make a PUT request when ID of object exists for a Lazy Relationship, with a custom Primary Key of Parent', async () => {
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

      test('Should make a PUT request for a Lazy Relationship that was fetched with find()', async () => {
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

    describe('delete()', () => {
      test('Should throw an exception when Model does not have an ID ', async () => {
        errorModel = () => {
          const post = new Post()
          post.delete()
        }

        expect(errorModel).toThrow('This model has a empty ID.')
      })

      test('Should hit the right resource', async () => {
        axiosMock.onAny().reply((config) => {
          expect(config.method).toEqual('delete')
          expect(config.url).toBe('http://localhost/posts/1')

          return [200, {}]
        })

        const post = new Post({ id: 1 })
        post.delete()
      })

      test('Should hit the right resource, with a custom Primary Key', async () => {
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

      test('Should hit the right resource for a Lazy Relationship', async () => {
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

      test('Should hit the right resource for a Lazy Relationship, with a custom Primary Key of Parent', async () => {
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
    })
  })

  describe('Relationship Operations', () => {
    describe('hasMany()', () => {
      test('Should hit right resource', async () => {
        axiosMock.onAny().reply((config) => {
          expect(config.method).toEqual('get')
          expect(config.url).toEqual('http://localhost/users/1/posts')

          return [200, {}]
        })

        const user = new User({ id: 1 })
        await user.posts().get()
      })

      test('Should hit right resource with find()', async () => {
        axiosMock.onAny().reply((config) => {
          expect(config.method).toEqual('get')
          expect(config.url).toEqual('http://localhost/users/1/posts/1')
          return [200, {}]
        })

        const user = new User({ id: 1 })
        await user.posts().find(1)
      })

      test('Should return a Collection of Models', async () => {
        axiosMock
          .onGet('http://localhost/users/1/posts')
          .reply(200, postsResponse)

        const user = new User({ id: 1 })
        const posts = await user.posts().get()

        posts.forEach((post) => {
          expect(post).toBeInstanceOf(Post)
        })
      })
    })

    describe('attach()', () => {
      test('Should hit right endpoint with a POST request', async () => {
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

      test('Should hit right endpoint with a POST request, with a custom Primary Key', async () => {
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
    })

    describe('sync()', () => {
      test('Should hit right endpoint with a PUT request', async () => {
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
    })

    describe('for()', () => {
      test('Should throw an error when does not receive a instance of Model', () => {
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

      test('Should throw an error when referenced object has not a valid id', () => {
        errorModel = () => {
          const user = new User({ name: 'Mary' })
          new Post({ text: 'Hello' }).for(user)
        }

        expect(errorModel).toThrow(
          'The object referenced on for() method has a invalid id.'
        )
      })

      test('Should setup the right resource', async () => {
        axiosMock.onPost().reply((config) => {
          expect(config.method).toEqual('post')
          expect(config.url).toEqual('http://localhost/users/1/posts')

          return [200, {}]
        })

        const user = new User({ id: 1 })
        const post = new Post({ text: 'Hello' }).for(user)
        await post.save()
      })

      test('Should produce the correct URL when calling with multiple arguments', () => {
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
    })
  })
})
