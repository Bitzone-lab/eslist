Eslist
=========

Control data

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

Al inicializar, se le asigna una key única a cada item del listado. Eslist te da la opción de asignar uno propio.

```js
const users = eslist(list, data => ({
    key: data.id,
    data // required
}))

users() // [{ key: 1, ... }, ...]
```

## Helper

Son datos adicionales de ayuda que se aplica a cada item del listado.

```js
const users = eslist(list, data => ({
    data, // required
    helper: { my_helper: 'any' }
}))

users.helper(key) // { my_helper: 'any' }
```

Cualquier tipo de dato es aceptable.

Cuando se añada un nuevo dato tambien es posible asignar le un helper.
```js
users.set(1, { id: 1, name: 'Juan' }, false, { my_helper: 'other' })
users.add({ id: 7, name: 'Lucía' }, false, { my_helper: 'other' })
```

## API and state

Al inicializar un listado, los datos pueden ser `never` o `added`. Los estados que existen son:

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

Si un dato no se le asigna una key al inicializar, pues este tomorá como estado `added`.

```js
const users = eslist(list) // <-- added
```

El resultado lo podrás obtener desde un metodo `mapping`. Itera en todos los datos y te devuelve el estado en que se encuentran.

```js
const users_added = eslist.mapping((data, state) => {
    if(state === 'added') return data
})
```

`mapping` funciona como un filtro tambien, puedes indicar le que datos quiere que retorne.

|Method | Description | Example |
|---|---| ---- |
| get | Obtiene un dato por su key | `get(key)` |
| add | Agrega un nuevo dato al listado | `add(data)` |
| update | Actualiza un dato por su id | `update(key, data)` |
| delete | Elimina un dato por su id | `delete(key)` |
| set | Ingresa un dato con una key personalizada | `set(key, data)` |
| each | Listado e incluyendo su key para cada item y helper | `each((data, helper, index) => data)` |

## Pending

Los datos pendientes son maneras para volver a su estado anterior si uno se retracta. Con ello podemos tomar la decisión si confirmamos la acción o cancelomos.

```js
const users = eslist([{ id: 1, name: 'Luis' }], data => ({
    key: data.id,
    data
}))
users.update(1, { name: 'Manuel' }, true) // tenemos que pasar como tercer parametro true
users.get(1) // { key: '1', id: 1, name: 'Manuel' }

// en caso de desear cancelar
users.cancel(1)
users.get(1) // { key: '1', id: 1, name: 'Luis' }
users.mapping((user, state) => state === 'updated' ? user : undefined).length // 0

// en caso de desear confirmar
users.confirm(1)
users.get(1) // { key: '1', id: 1, name: 'Manuel' }
users.mapping((user, state) => state === 'updated' ? user : undefined).length // 1
```

Es aplicable para `add`, `update`, `delete` y `set`

Un estado pendiente no se refleja en `mapping` mas solo en los demás a menos que se confirme.

```js
const users = eslist()
users.add({ name: 'Ana' }, true)
users().length // [{ key, name: 'Ana' }]
users.mapping((user, state) => state === 'added' ? user : undefined).length // 0
```

Cuando se realiza una actualización pendiente, eslist realiza un backup antes de actualizar. Este backup no es mutable y solo existirá hasta que se haya confirmado o cancelado la actualización. Para obtener ese backup se usa el método `frozen(key)`.

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

Es una manera de reemplazar los datos actuales por un nuevo listado pero evitando perder el estado que se encontraban esos datos.

```js
const users = eslist([ { id: 1, name: 'Liliana' } ])
users() // [ { key, id: 1, name: 'Liliana' } ]
users([{ id: 5, name: 'Michael' }])  // [{ key, id: 5, name: 'Michael' }]
users.mapping((user, state) => state === 'added' ? user : undefined).length // 2
```

En un portal tambien se puede configurar su key y helper inicial.

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

Si se desea inicializar, podemos usar el método `init`. Este se encargará de limpiar todo. Tambien puedes inicializar con nuevos datos.

```js
const users = eslist([ { id: 1, name: 'Liliana' } ])
users.init()

// con data

users.init([ { id: 9, name: 'manuel' } ], user => ({
    key: user.id,
    data: user,
    helper: 'MODE1'
}))
```
