import eslist from '../src'

describe('portal', function () {
    it('replace', function () {
        const users = eslist([{ name: 'Juan' }])
        expect(users()).toEqual(
            expect.arrayContaining([
                {
                    key: expect.any(String),
                    name: 'Juan'
                }
            ])
        )
        users([{ name: 'María' }])
        expect(users()).toEqual(
            expect.arrayContaining([
                {
                    key: expect.any(String),
                    name: 'María'
                }
            ])
        )
        expect(users().length).toBe(1)
        const mapping_users = users.mapping((user) => user)
        expect(mapping_users.length).toBe(2)
    })

    it('expect state', function () {
        const users = eslist([{ id: 1, name: 'Juan' }], (user) => ({
            key: user.id.toString(),
            data: user
        }))
        users.add({ id: 2, name: 'Liba' })
        expect(users([{ id: 5, name: 'Liliana' }]).length).toBe(1)
        const users_added = users.mapping((user, state) => (state === 'added' ? user : undefined))
        const users_default = users.mapping((user, state) =>
            state === 'default' ? user : undefined
        )
        expect(users_added.length).toBe(1)
        expect(users_default.length).toBe(2)
    })

    it('data with key', function () {
        const users = eslist([{ id: 1, name: 'Juan' }], (user) => ({
            key: user.id.toString(),
            data: user
        }))
        users.add({ id: 2, name: 'Ana' })
        expect(
            users([{ id: 3, name: 'Manuel' }], (user) => ({
                key: user.id.toString(),
                data: user
            })).length
        ).toBe(1)
        const users_added = users.mapping((user, state) => (state === 'added' ? user : undefined))
        const users_default = users.mapping((user, state) =>
            state === 'default' ? user : undefined
        )
        expect(users.each((user) => user).length).toBe(1)
        expect(users_added.length).toBe(1)
        expect(users_default.length).toBe(2)
    })
})
