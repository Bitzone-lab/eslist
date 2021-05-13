import { Store } from './utils/manufacturer_collection'

export default function help<T, K>(store: Store<T, K>) {
    function helper(id: string | number, content_helper?: K): K | null {
        const collection = store.get(id + '')
        if (content_helper && collection) {
            store.set(id + '', {
                ...collection,
                helper: typeof content_helper === 'object' ? { ...content_helper } : content_helper
            })
            return content_helper
        }
        const h = store.get(id.toString())?.helper
        return h === undefined ? null : h
    }

    function frozen(key: string | number): (T & { key: string }) | null {
        const collection = store.get(key.toString())
        if (collection && collection.backup) return { ...collection.backup, key: key.toString() }
        return null
    }

    return {
        helper,
        frozen
    }
}
