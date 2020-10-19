---
title: Installation
description: 'How to install vue-api-query in your project.'
position: 2
category: Getting Started
---

Add `vue-api-query` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add vue-api-query
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install vue-api-query
  ```

  </code-block>
</code-group>

## Nuxt

Create a plugin **~/plugins/vue-api-query.js**

```js{}[~/plugins/vue-api-query.js]
// inject global axios instance as http client to Model  

import { Model } from 'vue-api-query'

export default function (ctx, inject) {  
  Model.$http = ctx.$axios
}
```

And register it on **nuxt.config.js**

```js{}[nuxt.config.js]
export default {
  plugins: [
    '~plugins/vue-api-query'
  ],
}
```

## Vue

Set up on **src/main.js**

```js{}[src/main.js]
import axios from 'axios'
import { Model } from 'vue-api-query'

// inject global axios instance as http client to Model
Model.$http = axios
```
