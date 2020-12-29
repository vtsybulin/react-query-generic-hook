const standardAPI = (apiDriver, entity) => ({
  fetch: (query) => apiDriver.get(`${entity}/`, { params: query }),
  fetchOne: (id) => apiDriver.get(`${entity}/${id}/`),
  create: (body) => apiDriver.post(`${entity}/`, body),
  update: (body) => apiDriver.put(`${entity}/${body.id}/`, body),
  delete: (id) => apiDriver.delete(`${entity}/${id}/`),
});

export default standardAPI;
