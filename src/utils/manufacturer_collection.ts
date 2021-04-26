import { isDataSystem } from './expects'
import extract_id_data from './extract_id_data'

export type State = 'default' | 'deleted' | 'updated' | 'added' | 'setted'
export type Store<T, K> = Map<string, Collection<T, K>>

export interface Collection<T, K> {
    id: string
    state: State
    pending: 'deleted' | 'updated' | 'added' | null
    data: T
    backup: T | null
    system: boolean
    hide: boolean
    helper: K | undefined
}

export function init_collection<T, K>(data: T, helper: K | undefined): Collection<T, K> {
    const id = extract_id_data(data)
    const state: State = 'default'

    return {
        id,
        state,
        pending: null,
        data,
        backup: null,
        system: isDataSystem(data),
        hide: false,
        helper
    }
}
