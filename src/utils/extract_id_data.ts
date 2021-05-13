import createHash from './create_hash'
import { isDataSystem } from './expects'

export default function extract_id_data<T>(collection: T): string {
    const isSystem = isDataSystem(collection)
    const extractId = { id: '', _id: '', ...collection }
    const id = isSystem ? extractId.id.toString() || extractId._id.toString() : createHash()
    return id
}
