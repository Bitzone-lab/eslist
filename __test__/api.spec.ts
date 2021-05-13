import eslist from '../src'

describe('api', function () {
    it('get', function () {
        const users = eslist([{ name: 'Lilia' }, { id: 5, name: 'Nancy' }], (data) => ({
            key: data.id?.toString() || undefined,
            data
        }))
        expect(users.get('any_key')).toBeNull()
        expect(users.get('5')).toMatchObject({
            key: '5',
            id: 5,
            name: 'Nancy'
        })
    })

    it('add', function () {
        const users = eslist<{ name: string }>()
        const user = users.add({ name: 'Mario' })
        expect(user).toMatchObject({
            key: expect.any(String),
            name: 'Mario'
        })
    })

    it('update', function () {
        const users = eslist<{ id?: number; name: string }>([{ id: 7, name: 'Mario' }], (data) => ({
            key: data.id?.toString() || undefined,
            data
        }))
        const user = users.update('7', { name: 'Luis' })
        expect(user).toBeTruthy()
        const user2 = users.update('any', { name: 'Tania' })
        users.update('any', { id: 1 })
        expect(user2).toBeFalsy()
    })

    it('remove', function () {
        const users = eslist<{ id?: number; name: string }>([{ id: 7, name: 'Mario' }], (data) => ({
            key: data.id?.toString() || undefined,
            data
        }))
        expect(users.delete('7')).toBeTruthy()
        expect(users.delete('maybe')).toBeFalsy()
    })

    it('list', function () {
        const users = eslist<{ id?: number; name: string }>([
            { id: 7, name: 'Mario' },
            { name: 'Lilian' }
        ])
        expect(users().length).toBe(2)
        expect(users()).toEqual(
            expect.arrayContaining([
                { key: expect.any(String), id: 7, name: 'Mario' },
                { key: expect.any(String), name: 'Lilian' }
            ])
        )
    })

    it('set', function () {
        const users = eslist<{ name: string }>()
        expect(users.set(1, { name: 'mario' })).toBeTruthy()
        expect(users.get('1')).toMatchObject({
            key: '1',
            name: 'mario'
        })
    })
})
