import { Custom, State, Store } from './utils/manufacturer_collection'
import { init_collection } from './utils/manufacturer_collection'

export default function process<T, K>(store: Store<T, K>) {
    function mapping<L>(callbackfn: (data: T, state: State) => L): Array<L> {
        const response: Array<L> = []
        store.forEach((collection) => {
            const result = callbackfn(collection.data, collection.state)
            if (result !== undefined) {
                response.push(result)
            }
        })
        return response
    }

    function portal(list: Array<T>, custom?: (item: T) => Custom<T, K>): void {
        if (!custom) {
            store.forEach(function (collection) {
                collection.hide = true
            })
            for (const data of list) {
                const collection = init_collection<T, K>(data)
                store.set(collection.key, collection)
            }
            return
        }

        store.forEach(function (collection) {
            collection.hide = true
        })
        for (const data of list) {
            const custom_data = custom(data)
            const collection = init_collection<T, K>(
                custom_data.data,
                custom_data.helper,
                custom_data.key
            )
            const current_collection = store.get(collection.key)
            if (current_collection) {
                current_collection.hide = false
            } else {
                store.set(collection.key, collection)
            }
        }
    }

    function init(list: Array<T> = [], custom?: (item: T) => Custom<T, K>) {
        store.clear()
        list.forEach((data) => {
            let collection
            if (custom) {
                const config = custom(data)
                collection = init_collection<T, K>(config.data, config.helper, config.key)
            } else {
                collection = init_collection<T, K>(data)
            }
            store.set(collection.key, collection)
        })
    }

    function confirm(key: string | number): boolean {
        const collection = store.get(key + '')
        if (collection) {
            if (collection.pending) {
                collection.state = collection.pending
            } else {
                return false
            }
            collection.backup = null
            collection.pending = null
            return true
        }
        return false
    }

    function cancel(key: string | number): boolean {
        const collection = store.get(key.toString())
        if (collection) {
            if (collection.pending === 'added' || collection.pending === 'setted') {
                store.delete(key.toString())
                return true
            }

            if (collection.pending === 'deleted') {
                collection.backup = null
                collection.pending = null
                return true
            }

            if (collection.backup) {
                collection.data = collection.backup
                collection.backup = null
                collection.pending = null
                return true
            }

            return false
        } else {
            return false
        }
    }

    return {
        mapping,
        portal,
        init,
        confirm,
        cancel
    }
}
