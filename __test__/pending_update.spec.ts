import eslist from '../src'

const data_users = [
    {
        id: 1,
        name: 'Erick'
    },
    {
        id: 2,
        name: 'Mirian'
    }
]

interface User {
    id: number
    name: string
}

describe('Pending Update', function () {
    it('confirm', function () {
        const users = eslist<User>(data_users, (user) => ({
            key: user.id.toString(),
            data: user
        }))

        expect(users.update(1, { name: 'Juan' }, true)).toBeTruthy()

        expect(users()).toEqual(
            expect.arrayContaining([
                {
                    key: expect.any(String),
                    id: 1,
                    name: 'Juan'
                },
                {
                    key: expect.any(String),
                    id: 2,
                    name: 'Mirian'
                }
            ])
        )

        expect(users.frozen('1')).toMatchObject({
            key: expect.any(String),
            id: 1,
            name: 'Erick'
        })

        let users_updated = users.mapping((user, state) => (state === 'updated' ? user : undefined))
        expect(users_updated.length).toBe(0)

        expect(users.confirm('1')).toBeTruthy()
        users_updated = users.mapping((user, state) => (state === 'updated' ? user : undefined))
        expect(users_updated.length).toBe(1)
        expect(users.frozen('1')).toBeNull()
    })

    it('cancel', function () {
        const users = eslist<User>(data_users, (user) => ({
            key: user.id.toString(),
            data: user
        }))
        users.update(1, { name: 'Juan' }, true)

        expect(users()).toEqual(
            expect.arrayContaining([
                {
                    key: expect.any(String),
                    id: 1,
                    name: 'Juan'
                },
                {
                    key: expect.any(String),
                    id: 2,
                    name: 'Mirian'
                }
            ])
        )
        let users_updated = users.mapping((user, state) => (state === 'updated' ? user : undefined))
        expect(users_updated.length).toBe(0)
        users.cancel(1)
        expect(users()).toEqual(
            expect.arrayContaining([
                {
                    key: expect.any(String),
                    id: 1,
                    name: 'Erick'
                },
                {
                    key: expect.any(String),
                    id: 2,
                    name: 'Mirian'
                }
            ])
        )
        users_updated = users.mapping((user, state) => (state === 'updated' ? user : undefined))
        expect(users_updated.length).toBe(0)
        expect(users.frozen('1')).toBeNull()
    })
})
