import eslist from '../src'

const data_users = [
    {
        id: 1,
        name: 'Erick'
    }
]

describe('pending Add', function () {
    it('confirm', function () {
        const users = eslist(data_users)
        const user_created = users.add(
            {
                id: 99,
                name: 'Karen'
            },
            true
        )

        expect(user_created).toMatchObject({
            key: expect.any(String),
            id: 99,
            name: 'Karen'
        })

        expect(users()).toEqual(
            expect.arrayContaining([
                {
                    key: expect.any(String),
                    id: 1,
                    name: 'Erick'
                },
                {
                    key: expect.any(String),
                    id: 99,
                    name: 'Karen'
                }
            ])
        )

        let users_updated = users.mapping((user, state) => (state === 'added' ? user : undefined))
        expect(users_updated.length).toBe(0)

        expect(users.confirm(user_created.key)).toBeTruthy()
        users_updated = users.mapping((user, state) => (state === 'added' ? user : undefined))
        expect(users_updated.length).toBe(1)
    })

    it('cancel', function () {
        const users = eslist(data_users)
        const user_created = users.add(
            {
                id: 99,
                name: 'Karen'
            },
            true
        )

        users.cancel(user_created.key)
        expect(users().length).toBe(1)
        const users_updated = users.mapping((user, state) => (state === 'added' ? user : undefined))
        expect(users_updated.length).toBe(0)
    })
})
