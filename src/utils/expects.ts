export function isDataSystem<T>(collection: T) {
    return 'id' in collection || '_id' in collection
}
