import eslist from '../src'

const list = [
    { id: 1, name: 'Mario' },
    { id: 3, name: 'Luis' }
]

describe('help', function () {
    it('initial helper string', function () {
        const users = eslist(list, (user) => ({
            key: user.id.toString(),
            helper: '',
            data: user
        }))
        expect(users.helper(1)).toBe('')
        expect(users.helper(1, 'edition')).toBe('edition')
        expect(users.helper(2)).toBeNull()
        expect(users.helper(2, 'o.o')).toBeNull()
    })

    it('initial helper object', function () {
        const users = eslist(list, (user) => ({
            key: user.id.toString(),
            helper: { valid: '', mode: 'default' },
            data: user
        }))
        expect(users.helper(1)).toMatchObject({
            valid: '',
            mode: 'default'
        })
        expect(users.helper(3)).toMatchObject({
            valid: '',
            mode: 'default'
        })
        expect(
            users.helper(3, {
                valid: 'lorem',
                mode: 'creation'
            })
        ).toMatchObject({
            valid: 'lorem',
            mode: 'creation'
        })
        expect(users.helper(3)).toMatchObject({
            valid: 'lorem',
            mode: 'creation'
        })
        expect(users.helper(1)).toMatchObject({
            valid: '',
            mode: 'default'
        })
    })
})
