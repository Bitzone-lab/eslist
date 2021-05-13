import eslist, { Eslist } from '../src'

describe('Listore: Starting', () => {
    it('instance', () => {
        const users: Eslist<{ name: string }> = eslist([{ name: 'Raúl' }])
        expect(users().length).toBe(1)
    })

    it('init', function () {
        const users = eslist<{ name: string }>([])
        users.init([{ name: 'Juan' }, { name: 'Ana' }])
        expect(users().length).toBe(2)
    })

    it('set data creating instance and setting in init', function () {
        const users = eslist<{ name: string }>([{ name: 'Ana' }])
        users.init([{ name: 'Juan' }, { name: 'Luisa' }])
        expect(users().length).toBe(2)
        expect(users()).toEqual(
            expect.arrayContaining([
                { key: expect.any(String), name: 'Juan' },
                { key: expect.any(String), name: 'Luisa' }
            ])
        )
    })

    it('init to init', function () {
        const users = eslist<{ name: string }>()
        users.init([{ name: 'Mario' }])
        expect(users()).toEqual(
            expect.arrayContaining([{ key: expect.any(String), name: 'Mario' }])
        )
        users.init([{ name: 'Mirian' }])
        expect(users()).toEqual(
            expect.arrayContaining([{ key: expect.any(String), name: 'Mirian' }])
        )
    })
})
