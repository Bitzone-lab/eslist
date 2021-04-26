import { State, Store } from './utils/manufacturer_collection'
import extract_id_data from './utils/extract_id_data'
import { init_collection } from './utils/manufacturer_collection'

export default function process<T, K>(store: Store<T, K>) {
    function mapping<L>(callbackfn: (data: T, state: State) => L): Array<L> {
        const response: Array<L> = []
        store.forEach((collection) => {
            response.push(callbackfn(collection.data, collection.state))
        })
        return response
    }

    function portal(list: Array<T>, helper: K | undefined = undefined): void {
        const ids: string[] = []
        list.forEach((data) => {
            const id = extract_id_data(data)
            ids.push(id)
            if (!store.has(id)) {
                const collection = init_collection(data, helper)
                store.set(collection.id, collection)
            }
        })

        store.forEach(function (collection) {
            if (!ids.includes(collection.id)) {
                collection.hide = true
            }
        })
    }

    function init(list: Array<T> = [], helper: K | undefined = undefined) {
        store.clear()
        list.forEach((data) => {
            const collection = init_collection(data, helper)
            store.set(collection.id, collection)
        })
    }

    function confirm(id: string | number): boolean {
        const collection = store.get(id + '')
        if (collection && collection.backup) {
            collection.data = collection.backup
            collection.backup = null
            collection.pending = null
            return true
        }
        return false
    }

    function cancel(id: string | number): boolean {
        const collection = store.get(id + '')
        if (collection) {
            collection.backup = null
            collection.pending = null
            return true
        }
        return false
    }

    return {
        mapping,
        portal,
        init,
        confirm,
        cancel
    }
}
