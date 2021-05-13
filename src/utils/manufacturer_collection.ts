import createHash from './create_hash'

export type State = 'never' | 'deleted' | 'updated' | 'added' | 'setted'
export type Store<T, K> = Map<string, Collection<T, K>>

export interface Custom<T, K = undefined> {
    key?: string | number
    data: T
    helper?: K
}

export interface Collection<T, K> {
    key: string
    state: State
    pending: 'deleted' | 'updated' | 'added' | 'setted' | null
    data: T
    backup: T | null
    system: boolean
    hide: boolean
    helper: K | undefined
}

export function init_collection<T, K>(
    data: T,
    helper?: K | undefined,
    key?: string | number
): Collection<T, K> {
    const state: State = key === undefined ? 'added' : 'never'

    return {
        key: key === undefined ? createHash() : key.toString(),
        state,
        pending: null,
        data,
        backup: null,
        system: key !== undefined,
        hide: false,
        helper
    }
}
