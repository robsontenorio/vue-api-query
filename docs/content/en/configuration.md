---
title: Configuration
description: 'How to configure this package.'
position: 3
category: Getting Started
---

## Creating a Base Model

See the [API reference](/api/model-options) for a list of available options.

The first step is to create a base model to define the default options, in order to abstract configuration 
from your models. It should extend the 
[Base Model](https://github.com/robsontenorio/vue-api-query/blob/master/src/Model.js) of [vue-api-query](https://github.com/robsontenorio/vue-api-query).

The base model must implement two methods:
- `baseURL` - The base url of your REST API.
- `request` - The default request method.

Let's create a new file `Model.js` in `models` directory:

```js{}[~/models/Model.js]
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {

  // Define a base url for a REST API
  baseURL() {
    return 'http://my-api.com'
  }

  // Implement a default request method
  request(config) {
    return this.$http.request(config)
  }
}
```

<alert type="info">`$http` property is the HTTP Client Instance configured in [Installation](/installation) section.</alert>

## Creating the Domain Models

Now let's create our domain models that extends the base model. We can create as many models as we like.

Each model must implement:
- `resource` - The resource route of the model.

We can create a **User** model like this:
```js{}[~/models/User.js]
import Model from './Model'

export default class User extends Model {
  // Set the resource route of the model
  resource() {
    return 'users'
  }
}
```

This **User** model will make request to `/users` route as defined in `resource`.

We can also add extra methods and computed properties:

```js{}[~/models/User.js]
import Model from './Model'

export default class User extends Model {
  // Set the resource route of the model
  resource() {
    return 'users'
  }

  // Computed properties are reactive -> user.fullName
  // Make sure to use "get" prefix 
  get fullName () {
    return `${this.firstname} ${this.lastname}`
  }

  // Method -> user.makeBirthday()
  makeBirthday() {
    return this.age += 1
  }
}
```

### Typescript

<alert type="success">Available in version >= v1.9.0</alert>

If we are working on a Typescript project, we can infer the types of the fields, so we have intellisense.

#### Directly in Model
```ts{}[~/models/User.ts]
import Model from './Model'

export default class User extends Model {
  firstName: string
  lastName: string
  age: number

  ...
}
```

#### Using an Interface
```ts{}[~/models/User.ts]
import Model from './Model'

interface User {
  firstName: string
  lastName: string
  age: number
}

class User extends Model {
  ...
}

export default User
```

<alert type="info">You can use `!` operator to make non-null assertion.</alert>

## Changing the Primary Key

<alert type="info">By default, the `primaryKey` is set to `id`.</alert>

See the [API reference](/api/model-options#primarykey)

It's possible to change the primary key of a model by implementing the `primaryKey` method.
This way, the specified key will be used to build the query.

Let's create a **Post** model and set its primary key to `slug`.

```js{}[~/models/Post.js]
import Model from './Model'

export default class Post extends Model {
  // Set the resource route of the model
  resource() {
    return 'posts'
  }

  // Define the primary key of the model
  primaryKey() {
    return 'slug'
  }
```

This **Post** model will build the query using the `slug` as primary key: `/posts/{slug}`

## Defining Relationships

It's also possible to define the relationships of our models. By doing this, model instances will be automatically
applied to relationships, giving you access to all of their features.

### Eager Loaded Relationships

See the [API reference](/api/model-options#relations)

For relationships that have been eager loaded, we only need to implement the `relations` method 
to apply their model instances. It works for collections too.

The `relations` method must return an object, which the key is the property of the relationship, and the value is the
model instance.

Let's set up an eager loaded **User**, and an eager loaded collection of **Comments** for our **Post** model:

```js{}[~/models/Post.js]
import Model from './Model'
import User from './User'
import Comment from './Comment'

export default class Post extends Model {
  // Set the resource route of the model
  resource() {
    return 'posts'
  }

  // Define the primary key of the model
  primaryKey() {
    return 'slug'
  }

  // Apply model instances to eager loaded relationships
  relations() {
    return {
      user: User,
      comments: Comment
    }
  }
```

Now we can easily access an instance of the **User** model containing the eager loaded data 
using the specified key: `post.user`

The `relations` method also support nested keys, by dot notation:

```js{}[~/models/Post.js]
import Model from './Model'
import User from './User'
import Comment from './Comment'

export default class Post extends Model {
  // Set the resource route of the model
  resource() {
    return 'posts'
  }

  // Define the primary key of the model
  primaryKey() {
    return 'slug'
  }

  // Apply model instances to eager loaded relationships
  relations() {
    return {
      'relationships.user': User,
      'relationships.comments': Comment
    }
  }
```

Then we can access using the specified key: `post.relationships.user`

### Lazy Loading Relationships

See the [API reference](/api/model-options#hasmany)

To lazy load relationships, we just need to set up custom methods. Each method must return `hasMany(ModelInstance)`.

Let's set up a method to lazy load **Posts** in our **User** model:

```js{}[~/models/User.js]
import Model from './Model'
import Post from './Post'

export default class User extends Model {
  // Set the resource route of the model
  resource() {
    return 'users'
  }

  // Lazy load the posts that belongs to the user
  posts() {
    return this.hasMany(Post)
  }

  // Computed properties are reactive -> user.fullName
  // Make sure to use "get" prefix 
  get fullName () {
    return `${this.firstname} ${this.lastname}`
  }

  // Method -> user.makeBirthday()
  makeBirthday() {
    return this.age += 1
  }
}
```

Then we simply call the method `user.posts()` to lazy load the posts that belongs to the user.

## Customizing Query Parameters

See the [API reference](/api/model-options#parameternames)

If needed, we can easily customize the name of the query parameters by overriding the `parameterNames` method.

We can globally customize the names by doing this in the [Base Model](/configuration#creating-a-base-model):

```js{}[~/models/Model.js]
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {

  // Define a base url for a REST API
  baseURL() {
    return 'http://my-api.com'
  }

  // Implement a default request method
  request(config) {
    return this.$http.request(config)
  }

  // Override default query parameter names
  parameterNames() {
    const defaultParams = super.parameterNames()
    const customParams = {
      include: 'include_custom'
    }
    
    return { ...defaultParams, ...customParams }
  }
}
```

## Configuring FormData

See the [API reference](/api/model-options#formdata) and [object-to-formdata](https://github.com/therealparmesh/object-to-formdata#usage)

When uploading files, the data of our request will be automatically converted to `FormData` using `object-to-formdata`.

If needed, we can easily configure the options by overriding the `formData` method.

We can globally configure this in the [Base Model](/configuration#creating-a-base-model):

```js{}[~/models/Model.js]
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {

  // Define a base url for a REST API
  baseURL() {
    return 'http://my-api.com'
  }

  // Implement a default request method
  request(config) {
    return this.$http.request(config)
  }

  // Override default query parameter names
  parameterNames() {
    const defaultParams = super.parameterNames()
    const customParams = {
      include: 'include_custom'
    }
    
    return { ...defaultParams, ...customParams }
  }
  
  // Configure object-to-formadata
  formData() {
    return {
      indices: true
    }
  }
}
```
