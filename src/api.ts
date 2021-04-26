import { Store } from './utils/manufacturer_collection'
import createHash from './utils/create_hash'
import { init_collection } from './utils/manufacturer_collection'

export default function api<T, K>(store: Store<T, K>) {
    function set(id: string | number, data: T, helper?: K): boolean {
        if (store.has(id + '')) return false
        const collection = init_collection(data, helper)
        collection.state = 'setted'
        store.set(id + '', collection)
        return true
    }

    function add(
        data: T,
        pending: boolean = false,
        helper: K | undefined = undefined
    ): T & { id: string } {
        const id = createHash()
        const collection = init_collection(data, helper)
        if (pending) {
            collection.backup = { ...collection.data }
            collection.pending = 'added'
        } else {
            collection.state = 'added'
            collection.backup = null
            store.set(id, collection)
        }
        return {
            ...data,
            id
        }
    }

    function get(id: string | number): (T & { id: string }) | null {
        const collection = store.get(id + '')
        if (collection) {
            return { ...collection.data, id: collection.id }
        }
        return null
    }

    function update(id: string | number, data: T, pending: boolean = false): boolean {
        const collection = store.get(id + '')
        if (collection) {
            if (pending) {
                collection.backup = { ...collection.data }
                collection.pending = 'updated'
            } else {
                collection.pending = null
                collection.backup = null
                collection.state = 'updated'
            }
            collection.data = { ...collection.data, ...data }
        }
        return false
    }

    function _delete(id: string | number, pending: boolean = false): boolean {
        const collection = store.get(id + '')
        if (collection) {
            if (pending) {
                collection.pending = 'deleted'
                return true
            } else {
                collection.pending = null
                if (collection.system) {
                    collection.state = 'deleted'
                    return true
                } else {
                    return store.delete(id + '')
                }
            }
        }
        return false
    }

    const list = (): Array<T & { id: string }> => {
        const _list: Array<T & { id: string }> = []
        store.forEach((collection) => {
            if (!(collection.state === 'deleted' || collection.pending === 'deleted'))
                _list.push({ ...collection.data, id: collection.id })
        })
        return _list
    }

    function each<L>(
        callbackfn: (data: T & { id: string }, helper: K | null, index: number) => L
    ): Array<L> {
        const _list: Array<L> = []
        let count = -1
        store.forEach(function (collection) {
            if (!(collection.state === 'deleted' || collection.pending === 'deleted')) {
                count++
                _list.push(
                    callbackfn(
                        { ...collection.data, id: collection.id },
                        collection.helper || null,
                        count
                    )
                )
            }
        })
        return _list
    }

    return {
        set,
        add,
        get,
        update,
        _delete,
        list,
        each
    }
}
