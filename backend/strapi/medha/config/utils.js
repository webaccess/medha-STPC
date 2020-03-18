const _ = require("lodash");

function getRequestParams(params) {
  const page = params.page ? params.page : 1;
  const pageSize = params.pageSize ? params.pageSize : 10;
  const query = _.omit(params, ["page", "pageSize"]);
  return { page, query, pageSize };
}

function getPaginatedResponse(response) {
  return {
    result: response ? response.toJSON() : null,
    ...response.pagination
  };
}

function getResponse(response) {
  return {
    result: response ? response.toJSON() : null
  };
}

function getFindOneResponse(response) {
  return {
    result: response
  };
}

function getTotalRecords(model) {
  return strapi.query(model).count();
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  getRequestParams,
  getPaginatedResponse,
  getResponse,
  getFindOneResponse,
  getTotalRecords,
  asyncForEach
};
