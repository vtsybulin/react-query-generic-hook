# react-query-generic-hook

> React Query generic hook which should hopefully make working with APIs even more simple

[![NPM](https://img.shields.io/npm/v/react-query-generic-hook.svg)](https://www.npmjs.com/package/react-query-generic-hook) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**This is a work in progress ⚠️**

Live demo https://vtsybulin.github.io/react-query-generic-hook/

## Overview

The purpose of react-query-generic-hook is to bundle "endpoint" specific queries under one namespace with minimum code required.
What it does:

1. Exports "endpoint ready" queries and mutations in one place
2. Automatic namespace invalidation if any mutation succeeds
3. Agnostic to data retrieval method

## Setup
useGenericQueries expects to receive 3 params [queryKey, apiHandlers, genericEventsManager]

| Name                 	| Type    	| Description                                                                                                                                       	|
|----------------------	|---------	|---------------------------------------------------------------------------------------------------------------------------------------------------	|
| queryKey             	| String* 	| Like in react-query                                                                                                                               	|
| apiHandlers          	| Object* 	|       **ApiHandlers**                                                                                                                                            	|
| genericEventsManager 	| Object  	| **GenericEventsManager**	|

**ApiHandlers**
```
{
  fetch: () => {},
  fetchOne: () => {},
  create: () => {},
  update: () => {},
  delete: () => {},
}
```

**GenericEventsManager**
```
{
  onSuccess: (requestType, queryKey) => {},
  onError: (requestType, queryKey) => {},
  onMutate: (requestType, queryKey) => {},
}
```
## Usage

```jsx
import * as axios from 'axios';
import { useGenericQueries, standardAPI } from 'react-query-generic-hook';

const queryKey = 'users';

/**
* Custom usage. Should be an object with keys: fetch, fetchOne, create, update, delete
*/
const api = {
	fetch: () => axios.get(...),
	create: () => axios.post(...),
	delete: () => axios.delete(...)
	...
};

/**
* If you have a basic REST API you could make use of exported standardAPI util
* const api = standardAPI(axios, 'users');
*/

const Example = () => {

const { isQuerying, useFetch, useFetchOne, useCreate, useUpdate, useDelete } =
	useGenericQueries(queryKey, api);

//isQuerying is true if there's an active fetch query under namespace

// useFetch, useFetchOne usage is identical to original useQuery hook
const { data, isFetching, ... } = useFetch({});

// useCreate, useUpdate, useDelete usage is identical to original useMutation hook
// Any of the following function in case of success mutation will force a data refetch
[createUser] = useCreate({})
[deleteUser] = useDelete({})
[updateUser] = useUpdate({})

const onCreate = (data) => createUser(data);
const onDelete = (data) => deleteUser(data);
const onUpdate = (data) => updateUser(data);

}
```

## Install

```bash
yarn add react-query-generic-hook
```
## Peer Dependencies
The minimum supported version of react is ^16.8.0

The minimum supported version of react-query is ^2.0.0

Not yet tested with react-query ^3.0.0 and higher

## License

MIT © [vtsybulin](https://github.com/vtsybulin)
