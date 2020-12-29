import { useState } from 'react';
import {
  useQuery, useMutation, useIsFetching, queryCache,
} from 'react-query';

const requestTypes = {
  fetch: 'FETCH',
  create: 'CREATE',
  update: 'UPDATE',
  delete: 'DELETE',
};

const invalidateQuery = (queryKey) => queryCache.invalidateQueries(queryKey);

const defaultMutationConfig = {
  silent: false,
  shouldInvalidate: true,
};

const useGenericQueries = (queryKey, api, genericEventsManager) => {
  const isFetching = !!useIsFetching([queryKey]);
  const [queryHash, setQueryHash] = useState([queryKey]);

  const getDefaultMutationEvents = (
    requestType,
    config = defaultMutationConfig,
  ) => ({
    onSuccess: () => {
      const shouldInvalidate = requestType !== requestTypes.fetch
      && config?.shouldInvalidate
      && !config?.mutateReducer;

      if (!config?.silent && genericEventsManager?.onSuccess) {
        genericEventsManager.onSuccess(requestType, queryKey);
      }

      if (shouldInvalidate) {
        invalidateQuery(queryKey);
      }
    },
    onError: () => {
      if (!config?.silent && genericEventsManager?.onError) {
        genericEventsManager.onError(requestType, queryKey);
        // Should throw err up?
      }
    },

    /**
     * For optimistic updates
     */
    onMutate: config?.mutateReducer
      ? (mutatedValue) => {
        queryCache.cancelQueries(queryKey, { active: true });
        const query = queryCache.getQuery(queryHash);
        if (query) {
          const previousValue = queryCache.getQueryData(query.queryKey);
          queryCache.setQueryData(
            query.queryKey,
            (state) => config.mutateReducer(state, mutatedValue) || previousValue,
          );
        }
      }
      : null,
  });

  const withDefaultMutationConfig = (requestType, queryFunc, config, genericConfig) => [
    queryFunc,
    {
      ...getDefaultMutationEvents(requestType, genericConfig),
      ...config,
    },
  ];

  /**
   * API requests
   * @param {*} query
   */
  const fetchRequest = async (query) => {
    setQueryHash([queryKey, query]);
    const { data } = await api.fetch(query);
    return data;
  };

  const fetchOneRequest = async (id) => api.fetchOne(id);

  const createRequest = async (data) => api.create(data);

  const updateRequest = async (data) => api.update(data);

  const deleteRequest = async (data) => api.delete(data);

  /**
   * Universal queries
   * @param {*} query
   */

  const useFetch = (query, config, genericConfig) => useQuery([queryKey, query],
    () => fetchRequest(query), {
      enabled: query,
      ...getDefaultMutationEvents(requestTypes.fetch, {
        ...genericConfig, shouldInvalidate: false,
      }),
      ...config,
    });

  const useFetchOne = (id, config, genericConfig) => useQuery([queryKey, id], () =>
    fetchOneRequest(id), {
    enabled: id,
    ...getDefaultMutationEvents(requestTypes.fetch, {
      ...genericConfig, shouldInvalidate: false,
    }),
    ...config,
  });

  /**
   * Generic mutator
   * @param {*} requestType format {RequestTypes}
   * @param {*} requestFunc {Func}
   * @param {*} config {Object}
   */

  const useGenericMutation = (requestType, requestFunc, config, genericConfig) =>
    useMutation(...withDefaultMutationConfig(requestType, requestFunc, config, genericConfig));

  /**
   * Predefined mutations
   */

  const useCreate = (config, genericConfig) =>
    useGenericMutation(requestTypes.create, createRequest, config, genericConfig);

  const useUpdate = (config, genericConfig) =>
    useGenericMutation(requestTypes.update, updateRequest, config, genericConfig);

  const useDelete = (config, genericConfig) =>
    useGenericMutation(requestTypes.delete, deleteRequest, config, genericConfig);

  return {
    isFetching,
    useFetch,
    useFetchOne,
    useCreate,
    useUpdate,
    useDelete,
    useGenericMutation,
  };
};

export default useGenericQueries;
