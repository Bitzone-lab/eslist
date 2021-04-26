import listore, { Listore } from '../src'

describe('Listore: Starting', () => {
    it('instance', () => {
        const users: Listore<{ name: string }> = listore([{ name: 'Raúl' }])
        expect(users.list().length).toBe(1)
    })

    it('init', function () {
        const users = listore<{ name: string }>([])
        users.init([{ name: 'Juan' }, { name: 'Ana' }])
        expect(users.list().length).toBe(2)
    })

    it('set data creating instance and setting in init', function () {
        const users = listore<{ name: string }>([{ name: 'Ana' }])
        users.init([{ name: 'Juan' }, { name: 'Luisa' }])
        expect(users.list().length).toBe(2)
        expect(users.list()).toEqual(
            expect.arrayContaining([
                { id: expect.any(String), name: 'Juan' },
                { id: expect.any(String), name: 'Luisa' }
            ])
        )
    })
})
