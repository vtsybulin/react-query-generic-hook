import React, { useState } from 'react'
import * as axios from 'axios';
import { ReactQueryDevtools } from 'react-query-devtools'
import { Typography, Pagination, message } from 'antd';
import { useGenericQueries, standardAPI } from 'react-query-generic-hook';
import UsersList from './UsersList';
import "antd/dist/antd.css";

const { Text } = Typography;

const ApiClient = axios.create({
  baseURL: 'https://reqres.in/api/',
  validateStatus: (status) => status >= 200 && status < 300,
});

const genericEventsManager = {
  onSuccess: (requestType, queryKey) => message.success(`${requestType} request succeed for query key "${queryKey}"`),
  onError: (requestType, queryKey) => message.error(`${requestType} request failed for query key "${queryKey}"`),
}

const App = () => {
  const [fetchQueryConfig, setFetchQueryConfig] = useState({
    page: 1,
    per_page: 10
  })
  const { isFetching, useFetch, useCreate, useDelete } = useGenericQueries(
      'users',
      standardAPI(ApiClient, 'users'),
      genericEventsManager
  );

  const { data: { data: users = [], page, total } = {} } = useFetch(fetchQueryConfig, null, {
    silent: false,
  });

  const [createUser] = useCreate(null, {
    // This is optional. Required for optimistic-updates support
    mutateReducer: (state, res) => {
      return {
        ...state,
        data: [res, ...state.data]
      };
    }
  });

  const [deleteUser] = useDelete(null, {
    // This is optional. Required for optimistic-updates support
    mutateReducer: (state, id) => {
      return {
        ...state,
        data: state.data.filter((entry) => entry.id !== id)
      };
    }
  });

  const onCreate = (data) => createUser(data);

  const onDelete = (id) => deleteUser(id);

  const onPaginationChange = (page, per_page) =>
    setFetchQueryConfig({
      ...fetchQueryConfig,
      page,
      per_page
    })

    return (
    <div className="app">
      <div className="pagination-box">
        <Pagination
          pageSize={fetchQueryConfig.per_page}
          current={page}
          showSizeChanger
          onChange={onPaginationChange}
          total={total}
        />
        <br/>
        <Text>
          Any fetch in action for query key <Text code>users</Text>: {!!isFetching ? 'YES' : 'NO'}
        </Text>
      </div>
      <UsersList
        data={users}
        onCreate={onCreate}
        onDelete={onDelete}
      />
      <ReactQueryDevtools />
    </div>
  );
}

export default App
