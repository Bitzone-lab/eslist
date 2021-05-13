import eslist from '../src'

describe('Pending Set', function () {
    it('confirm', function () {
        const users = eslist<{ name: string }>([])
        expect(users.set(1, { name: 'Juan' }, true)).toBeTruthy()
        expect(users.get(1)).toMatchObject({
            name: 'Juan'
        })
        let users_setted = users.mapping((data, state) => {
            if (state === 'setted') return data
        })
        expect(users_setted.length).toBe(0)
        expect(users.confirm(1)).toBeTruthy()
        users_setted = users.mapping((data, state) => {
            if (state === 'setted') return data
        })
        expect(users_setted.length).toBe(1)
        expect(users.confirm(1)).toBeFalsy()
        expect(users().length).toBe(1)
    })

    it('cancel', function () {
        const users = eslist<{ name: string }>([])
        expect(users.set(1, { name: 'Juan' }, true)).toBeTruthy()
        expect(users.cancel(1)).toBeTruthy()
        const users_setted = users.mapping((data, state) => {
            if (state === 'setted') return data
        })
        expect(users_setted.length).toBe(0)
        expect(users.cancel(1)).toBeFalsy()
        expect(users().length).toBe(0)
    })
})
