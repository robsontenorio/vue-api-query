---
title: HTTP Methods
description: 'HTTP methods.'
position: 7
category: API
---

## `first`
- Returns: `Model | { data: Model }`

```js
await Model.first()
```

## `find`
- Arguments: `(identifier)`
- Returns: `Model | { data: Model }`

```js
await Model.find(1)
```

## `get`
- Returns: `Collection | { data: Collection }`

```js
await Model.get()
```

## `$first`
- Returns: `Model`

```js
await Model.$first()
```

## `$find`
- Arguments: `(identifier)`
- Returns: `Model`

```js
await Model.$find(1)
```

## `$get`
- Returns: `Collection`

```js
await Model.$get()
```
