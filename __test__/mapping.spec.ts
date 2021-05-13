import eslist from '../src'

describe('mapping', function () {
    it('add, delete, update', function () {
        const users = eslist<{ id: number; name: string; age: number }>(
            [{ id: 1, name: 'Alejandro', age: 75 }],
            (user) => ({ key: user.id.toString(), data: user })
        )
        users.add({ id: 55, name: 'Santa', age: 112 })
        users.update(1, { age: 55 })
        const users_updated = users.mapping((user, state) =>
            state === 'updated' ? user : undefined
        )
        const users_added = users.mapping((user, state) => (state === 'added' ? user : undefined))
        expect(users_added.length).toBe(1)
        expect(users_updated.length).toBe(1)
    })
})
