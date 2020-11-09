import collect, { Collection as CollectJS } from 'collect.js'
import Model from './Model'

export default class Collection extends Array {
  /**
   * Set the items of the array.
   *
   * @param {Model[]} collection
   */
  set items(collection) {
    const deleteCount = this.length;
    this.splice(0, deleteCount, ...collection);
  }

  /**
   * Get the items of the array.
   *
   * @return Model[]
   */
  get items () {
    return [...this]
  }

  /**
   * Apply [Collection]{@link CollectJS} instance of [collect.js]{@link https://github.com/ecrmnn/collect.js} to array.
   *
   * @param {Model[]} [items]
   * @return CollectJS
   */
  _collection(items) {
    return collect(items || this.items)
  }

  /**
   * Get the primary key of the [Models]{@link Model} in the {@link Collection}.
   *
   * @return string
   */
  _primaryKey() {
    this._collection().first().primaryKey()
  }

  /**
   * Apply {@link Collection} instance to array.
   *
   * @return this
   */
  _respond(collection) {
    if (collection instanceof CollectJS) {
      collection = collection.all()
    }

    if (!(collection instanceof Collection)) {
      collection = new this.constructor(collection)
    }

    return collection
  }

  /**
   * Get a dictionary keyed by primary keys.
   *
   * @param {Model[]} [items]
   * @return Record<string, Model>
   */
  getDictionary(items) {
    items = items || this.items
    const dictionary = {}

    for (value of items) {
      dictionary[value.getPrimaryKey()] = value
    }

    return dictionary
  }

  /**
   * Find a model in the collection by key.
   *
   * @param {string|number|string[]|number[]|Model} key
   * @return Model|this
   */
  find(key) {
    if (key instanceof Model) {
      key = key.primaryKey()
    }

    if (Array.isArray(key)) {
      if (this._collection().isEmpty()) {
        return this
      }

      return this._respond(this._collection().whereIn(this._primaryKey(), key))
    }

    return this._collection().first(model => model.getPrimaryKey() === key) || {}
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
   * @return this
   */
  only(keys) {
    if (!keys) {
      return this
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
      return this
    }

    return this._respond(this._collection().whereNotIn(this._primaryKey(), keys))
  }

  /**
   * Return only unique items from the collection.
   *
   * @param {string|Function} [key]
   * @return this
   */
  unique(key) {
    if (key) {
      return this._respond(this._collection().unique(key))
    }

    return this._respond([...this.getDictionary()])
  }

  /**
   * Diff the collection with the given items.
   *
   * @param {Model[]} items
   * @return this
   */
  diff(items) {
    const dictionary = this.getDictionary(items)
    const collection = this.items.filter(item => !dictionary[item.getPrimaryKey()])

    return this._respond(collection)
  }

  /**
   * Intersect the collection with the given items.
   *
   * @param {Model[]} items
   * @return this
   */
  intersect(items) {
    const dictionary = this.getDictionary(items)
    const collection = this.items
      .filter(item => !!dictionary[item.getPrimaryKey()])

    return this._respond(collection)
  }

  /**
   * Get the array of primary keys.
   *
   * @return string[]|number[]
   */
  modelKeys() {
    const collection = this.items.map((model) => model.getPrimaryKey())

    return this._respond(collection)
  }

  /**
   * Get the Query Builder from the collection.
   *
   * @return Model
   *
   * @throws Error
   */
  toQuery() {
    const collection = this._collection()
    const model = collection.first()

    if (!model) {
      throw new Error('Unable to create query for empty collection.')
    }

    if (collection.filter((_model) => {
      return !_model instanceof model.constructor
    }).isNotEmpty()) {
      throw new Error('Unable to create query for collection with mixed types.')
    }

    return model.newModelQuery().whereKey(this.modelKeys())
  }

  /**
   * Reload a fresh model instance from the database for all the entities.
   *
   * @param {string|string[]} include
   * @return this
   */
  fresh(include) {
    include = Array.isArray(include) ? include : arguments
    const collection = this._collection()

    if (collection.isEmpty()) {
      return this
    }

    const freshModels = this.toQuery().include(...include).$get().getDictionary()

    return this._respond(collection.map((model) => {
      const freshModel = freshModels[model.getPrimaryKey()]

      if (model.hasId() && !!freshModel) {
        return freshModel
      }
    }))
  }
}

const methods = Reflect.ownKeys(CollectJS.prototype).filter(x => {
  return !Reflect.ownKeys(Collection.prototype).some(v => x !== v)
})

for (const method of methods) {
  Collection.prototype[method] = function (...args) {
    return this._respond(this._collection()[method](...args))
  }
}
