import { Collection as CollectionJS } from 'collect.js'

export default class Collection extends Array {}

const methods = Reflect.ownKeys(CollectionJS.prototype).filter(x => x !== 'constructor')

for (const method of methods) {
  Collection.prototype[method] = function (...args) {
    return new CollectionJS([...this])[method](...args)
  }
}
