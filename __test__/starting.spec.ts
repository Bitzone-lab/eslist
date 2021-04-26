import Listore from '../src'

describe('Listore: Starting', () => {
    it('instance', () => {
        const listore = Listore([{ name: 'Raúl' }])
        expect(listore.list().length).toBe(1)
    })
})
