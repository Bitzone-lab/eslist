import eslist from '../src'

const data_users = [
    {
        id: 1,
        name: 'Erick'
    },
    {
        id: 2,
        name: 'Luis'
    }
]

describe('Pending Delete', function () {
    it('confirm', function () {
        const users = eslist(data_users, (data) => ({
            key: data.id.toString(),
            data
        }))

        expect(users.delete('1', true)).toBeTruthy()
        expect(users().length).toBe(1)
        expect(users.confirm('1')).toBeTruthy()
        expect(users().length).toBe(1)
        expect(users.confirm('1')).toBeFalsy()
    })

    it('cancel', function () {
        const users = eslist(data_users, (data) => ({
            key: data.id.toString(),
            data
        }))

        expect(users.delete('1', true)).toBeTruthy()
        expect(users().length).toBe(1)
        expect(users.cancel('1')).toBeTruthy()
        expect(users().length).toBe(2)
        expect(users.cancel('1')).toBeFalsy()
    })
})
