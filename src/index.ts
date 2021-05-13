import api from './api'
import help from './help'
import process from './process'
import { Store, State, Custom } from './utils/manufacturer_collection'
export interface Eslist<T, K = undefined> {
    (list?: Array<T>, custom?: (item: T) => Custom<T, K>): Array<T & { key: string }>
    add: (data: T, pending?: boolean, helper?: K | undefined) => T & { key: string }
    set: (key: string | number, data: T, pending?: boolean, helper?: K | undefined) => boolean
    update: (key: string | number, data: Partial<T>, pending?: boolean) => boolean
    delete: (key: string | number, pending?: boolean) => boolean
    get: (key: string | number, force?: boolean) => (T & { key: string }) | null
    each: <L>(
        callbackfn: (data: T & { key: string }, helper: K | null, index: number) => L
    ) => Array<L>
    init: (list?: T[], custom?: (item: T) => Custom<T, K>) => void
    mapping: <L>(callbackfn: (data: T, state: State) => L) => L[]
    confirm: (key: string | number) => boolean
    cancel: (key: string | number) => boolean
    helper: (key: string | number, content_helper?: K | undefined) => K | null
    frozen: (key: string | number) => (T & { key: string }) | null
}

function eslist<T, K = undefined>(
    collections: Array<T> = [],
    custom?: (item: T) => Custom<T, K>
): Eslist<T, K> {
    const store: Store<T, K> = new Map()
    const { init, mapping, portal, confirm, cancel } = process(store)

    init(collections, custom)

    const { add, set, update, del, datalist, get, each } = api(store)
    const { helper, frozen } = help(store)

    function eslist_api(list?: Array<T>, customize?: (item: T) => Custom<T, K>) {
        list && portal(list, customize)
        return datalist()
    }

    eslist_api.add = add
    eslist_api.set = set
    eslist_api.update = update
    eslist_api.delete = del
    eslist_api.get = get
    eslist_api.each = each
    eslist_api.init = init
    eslist_api.mapping = mapping
    eslist_api.confirm = confirm
    eslist_api.cancel = cancel
    eslist_api.helper = helper
    eslist_api.frozen = frozen

    return eslist_api
}

export default eslist
