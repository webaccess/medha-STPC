const _ = require("lodash");

function getRequestParams(params) {
  const page = params.page ? parseInt(params.page) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
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

const getNumberOfPages = (list, numberPerPage) => {
  return Math.ceil(list.length / numberPerPage);
};

/**
 *
 * @param {*} list // Resultset of query
 * @param {*} currentPage // Which page data to fetch
 * @param {*} numberPerPage // How many number of rows to return
 *
 * @returns {Object}
 */
function paginate(list, currentPage, numberPerPage) {
  const totalRecords = list ? list.length : 0;
  numberPerPage = numberPerPage === -1 ? totalRecords : numberPerPage;

  const start = (currentPage - 1) * numberPerPage;
  const end = start + numberPerPage;

  const totalPages = getNumberOfPages(list, numberPerPage);

  const result = list.slice(start, end);

  return {
    result,
    pagination: {
      page: currentPage,
      pageSize: numberPerPage,
      rowCount: totalRecords,
      pageCount: totalPages
    }
  };
}

module.exports = {
  getRequestParams,
  getPaginatedResponse,
  getResponse,
  getFindOneResponse,
  getTotalRecords,
  asyncForEach,
  paginate
};
