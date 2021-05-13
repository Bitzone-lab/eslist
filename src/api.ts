import { Store } from './utils/manufacturer_collection'
import createHash from './utils/create_hash'
import { init_collection } from './utils/manufacturer_collection'

export default function api<T, K>(store: Store<T, K>) {
    function set(key: string | number, data: T, pending: boolean = false, helper?: K): boolean {
        if (store.has(key.toString())) return false
        const collection = init_collection(data, helper)
        if (pending) {
            collection.pending = 'setted'
        } else {
            collection.state = 'setted'
        }
        store.set(key.toString(), { ...collection, key: key.toString() })
        return true
    }

    function add(data: T, pending: boolean = false, helper?: K): T & { key: string } {
        const key = createHash()
        const collection = init_collection(data, helper)
        if (pending) {
            collection.pending = 'added'
        } else {
            collection.state = 'added'
            collection.backup = null
        }

        store.set(key, collection)
        return {
            ...data,
            key
        }
    }

    function get(key: string | number, force: boolean = false): (T & { key: string }) | null {
        const collection = store.get(key.toString())
        if (force) {
            if (collection) {
                return { ...collection.data, key: collection.key }
            }
        } else if (collection && !collection.hide) {
            return { ...collection.data, key: collection.key }
        }

        return null
    }

    function update(key: string | number, data: Partial<T>, pending: boolean = false): boolean {
        const collection = store.get(key.toString())
        if (collection && !collection.hide) {
            if (pending) {
                collection.backup = { ...collection.data }
                collection.pending = 'updated'
            } else {
                collection.pending = null
                collection.backup = null
                collection.state = 'updated'
            }
            collection.data = { ...collection.data, ...data }
            return true
        }
        return false
    }

    function del(key: string | number, pending: boolean = false): boolean {
        const collection = store.get(key.toString())
        if (collection && !collection.hide) {
            if (pending) {
                collection.pending = 'deleted'
                return true
            } else {
                collection.pending = null
                if (collection.system) {
                    collection.state = 'deleted'
                    return true
                } else {
                    return store.delete(key.toString())
                }
            }
        }
        return false
    }

    const datalist = (): Array<T & { key: string }> => {
        const list: Array<T & { key: string }> = []
        store.forEach((collection) => {
            if (
                !(
                    collection.state === 'deleted' ||
                    collection.pending === 'deleted' ||
                    collection.hide
                )
            )
                list.push({ ...collection.data, key: collection.key })
        })
        return list
    }

    function each<L>(
        callbackfn: (data: T & { key: string }, helper: K | null, index: number) => L
    ): Array<L> {
        const list: Array<L> = []
        let count = -1
        store.forEach(function (collection) {
            if (
                !(
                    collection.state === 'deleted' ||
                    collection.pending === 'deleted' ||
                    collection.hide
                )
            ) {
                count++
                list.push(
                    callbackfn(
                        { ...collection.data, key: collection.key },
                        collection.helper || null,
                        count
                    )
                )
            }
        })
        return list
    }

    return {
        set,
        add,
        get,
        update,
        del,
        datalist,
        each
    }
}
