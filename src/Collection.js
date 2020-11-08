import collect, { Collection as CollectJS } from 'collect.js'
import Model from './Model'

export default class Collection extends Array {
  /**
   * Apply [Collection]{@link CollectJS} instance of [collect.js]{@link https://github.com/ecrmnn/collect.js} to array.
   *
   * @return CollectJS
   */
  _collection() {
    return collect([...this])
  }

  _primaryKey() {
    this._collection().first().primaryKey()
  }

  _respond(collection) {
    if (collection instanceof CollectJS) {
      collection = collection.all()
    }

    return new this.constructor(collection)
  }

  /**
   * Get a dictionary keyed by primary keys.
   *
   * @param  {[]|null} items
   * @return array
   */
  getDictionary(items = null)
  {
    items = !items ? [...this] : items
    const dictionary = []

    for (value of items) {
      dictionary[value.getPrimaryKey()] = value
    }

    return dictionary;
  }

  /**
   * Find a model in the collection by key.
   *
   * @param {string|string[]|Model} key
   * @return Model|CollectJS|null
   */
  find(key) {
    if (key instanceof Model) {
      key = key.primaryKey()
    }

    if (Array.isArray(key)) {
      if (this._collection().isEmpty()) {
        return this._respond()
      }

      return this._respond(this._collection().whereIn(this._primaryKey(), key))
    }

    return this._collection().first(model => model.getPrimaryKey() === key)
  }

  /**
   * Determine if a key exists in the collection.
   *
   * @param {string|Model|(function(any): boolean)} key
   * @param {unknown} [value]
   * @return boolean
   */
  contains(key, value) {
    if (arguments.length > 1) {
      return this._collection().contains(...arguments)
    }

    if (key instanceof Model) {
      return this._collection().contains(model => model.getPrimaryKey() === key.getPrimaryKey())
    }

    return this._collection().contains(model => model.getPrimaryKey() === key)
  }

  /**
   * Returns only the models from the collection with the specified keys.
   *
   * @param {string[]} keys
   * @return CollectJS
   */
  only(keys) {
    if (!keys) {
      return this._respond()
    }

    return this._respond(this._collection().whereIn(this._primaryKey(), keys))
  }

  /**
   * Returns all models in the collection except the models with specified keys.
   *
   * @param {string[]} keys
   * @return this
   */
  except(keys) {
    if (!keys) {
      return this._respond()
    }

    return this._respond(this._collection().whereNotIn(this._primaryKey(), keys))
  }
}

const methods = Reflect.ownKeys(CollectJS.prototype).filter(x => {
  return !Reflect.ownKeys(Collection.prototype).some(v => x !== v)
})

for (const method of methods) {
  Collection.prototype[method] = function (...args) {
    return new Collection(this._collection()[method](...args).all())
  }
}
