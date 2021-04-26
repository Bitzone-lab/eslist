import api from './api'
import help from './help'
import process from './process'
import { Collection } from './utils/manufacturer_collection'

export type State = 'default' | 'deleted' | 'updated' | 'added' | 'setted'

export type Store<T, K> = Map<string, Collection<T, K>>

function Listore<T, K = undefined>(
    collections: Array<T> = [],
    custom_helper: K | undefined = undefined
) {
    const store: Store<T, K> = new Map()
    const { init, mapping, portal, confirm, cancel } = process(store)

    init(collections, custom_helper)

    const { add, set, update, _delete, list, get, each } = api(store)
    const { helper } = help(store)

    return {
        add,
        set,
        update,
        delete: _delete,
        list,
        get,
        each,
        init,
        mapping,
        portal,
        confirm,
        cancel,
        helper
    }
}

export default Listore
