import eslist from '../src'

describe('Force Cancel Pending', function () {
    it('update', function () {
        const users = eslist<{ id: number; name: string }>([{ id: 1, name: 'Juan' }], (user) => ({
            key: user.id.toString(),
            data: user
        }))
        expect(users.update(1, { name: 'Mario' }, true)).toBeTruthy()
        expect(users.get(1)).toMatchObject({
            key: '1',
            id: 1,
            name: 'Mario'
        })
        expect(users.update(1, { name: 'Antonio' })).toBeTruthy()
        expect(users.get(1)).toMatchObject({
            key: '1',
            id: 1,
            name: 'Antonio'
        })
        expect(users.confirm(1)).toBeFalsy()
    })

    it('add and delete', function () {
        const users = eslist<{ name: string }>()
        const user = users.add({ name: 'Luisa' }, true)
        expect(users.get(user.key)).toMatchObject({
            key: expect.any(String),
            name: 'Luisa'
        })
        expect(users.delete(user.key)).toBeTruthy()
        expect(users.confirm(1)).toBeFalsy()
        const mapping_users = users.mapping((user) => user)
        expect(mapping_users.length).toBe(0)
    })
})
