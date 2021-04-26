import api from './api'
import help from './help'
import process from './process'
import { Store, State } from './utils/manufacturer_collection'

export interface Listore<T, K = undefined> {
    add: (data: T, pending?: boolean, helper?: K | undefined) => T & { id: string }
    set: (id: string | number, data: T, helper?: K | undefined) => boolean
    update: (id: string | number, data: T, pending?: boolean) => boolean
    delete: (id: string | number, pending?: boolean) => boolean
    list: () => Array<T & { id: string }>
    get: (id: string | number) => (T & { id: string }) | null
    each: <L>(callbackfn: (data: T & { id: string }, helper: K | null, index: number) => L) => L[]
    init: (list?: T[], helper?: K | undefined) => void
    mapping: <L>(callbackfn: (data: T, state: State) => L) => L[]
    portal: (list: T[], helper?: K | undefined) => void
    confirm: (id: string | number) => boolean
    cancel: (id: string | number) => boolean
    helper: (id: string | number, content_helper?: K | undefined) => K | null
}

function listore<T, K = undefined>(
    collections: Array<T> = [],
    custom_helper: K | undefined = undefined
): Listore<T, K> {
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

export default listore
