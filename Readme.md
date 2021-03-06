Eslist
=========

Control data list

```
npm install eslist
```

### Usage

**Javascript**

```ts
import eslist from 'eslist'

const users = eslist(list)

users() // [{ key, ... }, ...]
```

**Typescript**
```ts
import eslist, { Eslist } from 'eslist'

const users = eslist<ListInterface>(list)

// or

const users: Eslist<ListInterface> = eslist(list)

users() // [{ key, ... }, ...]
```

When initializing, a unique key is assigned to each item in the list. Eslist gives you the option to assign your own. 

```js
const users = eslist(list, data => ({
    key: data.id,
    data // required
}))

users() // [{ key: 1, ... }, ...]
```

## Helper

They are additional help data that is applied to each item in the list. 

```js
const users = eslist(list, data => ({
    data, // required
    helper: { my_helper: 'any' }
}))

users.helper(key) // { my_helper: 'any' }
```

Any type of data is acceptable.

When adding new data it is also possible to assign it a helper. 
```js
users.set(1, { id: 1, name: 'Juan' }, false, { my_helper: 'other' })
users.add({ id: 7, name: 'Lucía' }, false, { my_helper: 'other' })
```

## API and state

When initializing a listing, the data can be either `never` or` added`. The states that exist are: 

* never
* added
* deleted
* setted
* updated

```js
const users = eslist(list, data => ({
    key: data.id,
    data // required
}))                     // <-- never
users.add(data)         // <-- added
users.update(key, data) // <-- updated
users.delete(key)       // <-- deleted
users.set(key, data)    // <-- setted
```

If a data is not assigned a key when initializing, then it will take as state `added`. 

```js
const users = eslist(list) // <-- added
```

The result can be obtained from a `mapping` method. Iterates in all the data and returns you the state in which they are.

```js
const users_added = eslist.mapping((data, state) => {
    if(state === 'added') return data
})
```

`mapping` works as a filter too, you can tell it what data you want it to return. 

| Method | Description | Example |
|---|---|------|
| get | Obtains a data by its key | `get(key)` |
| add | Add a new data to the list | `add(data)` |
| update | Update a data by its id | `update(key, data)` |
| delete | Delete a data by its id  | `delete(key)` |
| set | Enter a data with a custom key  | `set(key, data)` |
| each | List including its key for each item and helper | `each((data, helper, index) => data)` |

## Pending

Pending data are ways to revert to your previous state if you retract. With this we can make the decision if we confirm the action or cancel.

```js
const users = eslist([{ id: 1, name: 'Luis' }], data => ({
    key: data.id,
    data
}))
users.update(1, { name: 'Manuel' }, true) // we have to pass as the third parameter true 
users.get(1) // { key: '1', id: 1, name: 'Manuel' }

// in case you want to cancel 
users.cancel(1)
users.get(1) // { key: '1', id: 1, name: 'Luis' }
users.mapping((user, state) => state === 'updated' ? user : undefined).length // 0

// in case you want to confirm 
users.confirm(1)
users.get(1) // { key: '1', id: 1, name: 'Manuel' }
users.mapping((user, state) => state === 'updated' ? user : undefined).length // 1
```

It is applicable for  `add`, `update`, `delete` and `set`

A pending state is not reflected in `mapping` but only in the others unless it is confirmed.

```js
const users = eslist()
users.add({ name: 'Ana' }, true)
users().length // [{ key, name: 'Ana' }]
users.mapping((user, state) => state === 'added' ? user : undefined).length // 0
```

When a pending update is performed, eslist performs a backup before updating. This backup is not mutable and will only exist until the update has been confirmed or canceled. To obtain this backup, the `frozen (key)` method is used.

```js
const users = eslist([{ id: 1, name: 'Luis' }], data => ({
    key: data.id,
    data
}))
users.update(1, { name: 'Manuel' }, true)
users.get(1) // { key: '1', id: 1, name: 'Manuel' }
users.frozen(1) // { key: '1', id: 1, name: 'Luis' }
users.confirm(1)
users.frozen(1) // null
```

## Portal

It is a way of replacing the current data with a new list but avoiding losing the state of that data. 

```js
const users = eslist([ { id: 1, name: 'Liliana' } ])
users() // [ { key, id: 1, name: 'Liliana' } ]
users([{ id: 5, name: 'Michael' }])  // [{ key, id: 5, name: 'Michael' }]
users.mapping((user, state) => state === 'added' ? user : undefined).length // 2
```

In a portal you can also configure your key and initial helper.

```js
const users = eslist([ { id: 1, name: 'Liliana' } ])
users() // [ { key, id: 1, name: 'Liliana' } ]
users([{ id: 5, name: 'Michael' }], user => ({
    key: user.id,
    data: user,
    helper: 'mode1'
}))  // [{ key: '5', id: 5, name: 'Michael' }]
```

## Initial

If you want to initialize, you can use the `init` method. This will take care of cleaning everything. You can also initialize with new data. 

```js
const users = eslist([ { id: 1, name: 'Liliana' } ])
users.init()

// with data.

users.init([ { id: 9, name: 'manuel' } ], user => ({
    key: user.id,
    data: user,
    helper: 'MODE1'
}))
```
