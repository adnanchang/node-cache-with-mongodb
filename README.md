# Node-cache Playground    

> A NodeJS/Express App with `node-cache` as temporary storage with mongoDB at the back

## Build Setup

``` bash
# install dependencies
npm install

# serve at localhost:3000
npm start

# you can also try this
nodemon app.js
```

## Database Setup

Just make sure you have a running MongoDB instance on port `27017` or just change the port to a desired value in `middleware/dbConnect.js`

---

# API Documentation

## Get All

Get all the entries inside the cache.

**URL** : `/cache/`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "9": "senior_red_cat",
    "fff": "flexible_aqua_tahr"
}
```

## Error Response

**Condition** : If something is faulty in the cache.

**Code** : `400 BAD REQUEST`

**Content** :

```
Whoops! Could not retrieve the entries. Try again
```




## Get Single Cache Entry

Get a single entry in the cache based on the key.

**URL** : `/cache/item/:key`

**Method** : `GET`

**Auth required** : NO

**Data example**

```json
/cache/item/222
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "key": "fff",
    "data": "flexible_aqua_tahr"
}
```

## Error Response

**Condition** : If the given key could not be found AND set as new

**Code** : `400 BAD REQUEST`

**Content** :

```
Whoops! Could not get the given key. Try again
```




## Update Single Cache Entry

Update a single entry in the cache based on the key.

**URL** : `/cache/item/:key`

**Method** : `PUT`

**Auth required** : NO

**Data example**

```json
/cache/item/222
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "key": "2",
    "data": "presidential_plum_ape"
}
```

## Error Response

**Condition** : If the given key could not be found

**Code** : `400 BAD REQUEST`

**Content** :

```
Whoops! Could not update entry. Try again
```




## Delete Single Cache Entry

Delete a single entry in the cache based on the key.

**URL** : `/cache/item/:key`

**Method** : `DELETE`

**Auth required** : NO

**Data example**

```json
/cache/item/222
```

## Success Response

**Code** : `200 OK`

**Content example**

```
Cache item was deleted
```

## Error Response

**Condition** : Something went wrong in the cache, the delete itself doesn't fail based on the library but just in case something crashed

**Code** : `400 BAD REQUEST`

**Content** :

```
Whoops! Could not delete entry. Try again
```




## Delete All Cached Entries

Delete all entries in the cache

**URL** : `/cache/`

**Method** : `DELETE`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```
Cache was cleared, [number_of_deleted_items] items deleted
```

## Error Response

**Condition** : Something went wrong in the cache, the delete itself doesn't fail based on the library but just in case something crashed

**Code** : `400 BAD REQUEST`

**Content** :

```
Whoops! Could not delete the entries. Try again
```
