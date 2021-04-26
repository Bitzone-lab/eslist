import { Store } from '.'

export default function help<T, K>(store: Store<T, K>) {
    function helper(id: string | number, content_helper?: K): K | null {
        const collection = store.get(id + '')
        if (content_helper && collection) {
            store.set(id + '', { ...collection, helper: content_helper })
            return content_helper
        }
        return store.get(id + '')?.helper || null
    }

    return {
        helper
    }
}
