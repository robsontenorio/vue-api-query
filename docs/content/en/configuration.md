---
title: Configuration
description: 'How to configure this package.'
position: 3
category: Getting Started
---

## Define a base model

Your base model should extend from `vue-api-query` Model. Use base models is good practice in order to abstract configurations from your domain models.

```js{}[models/Model.js]
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

  // Configure custom parameter names
  parameterNames() {
    return {
      include: 'include',
      filter: 'filter',
      sort: 'sort',
      fields: 'fields',
      append: 'append',
      page: 'page',
      limit: 'limit'
    }
  }
}

```

## Define your domain models

Just extends from your base model, implement the [`resource()`](/api/options#resource) method... and done! 

```js{}[models/User.js]
import Model from './Model'

export default class User extends Model {
  resource() {
    return 'users'
  }
}
```

But, if your model does not work with default primary key ('id'), you need to override the [`primaryKey()`](/api/options#primarykey) method:

```js{}[models/User.js]
import Model from './Model'

export default class User extends Model {
  primaryKey() {
    return 'someId'
  }
}
```

Of course you can add extra methods and computed properties like this:

```js{}[models/User.js]
import Model from './Model'

export default class User extends Model {
  
  // Computed properties are reactive -> user.fullname
  // Make sure to use "get" prefix 
  get fullname() {
    return `${this.firstname} ${this.lastname}`
  }

  // method -> user.makeBirthday()
  makeBirthday() {
    this.age += 1
  }
}
```

You can set up relationships:

```js{}[models/User.js]
import Model from './Model'
import Post from './Post'

export default class User extends Model {

  posts () {
    return this.hasMany(Post)
  }
}
```
