const _ = require("lodash");
const moment = require("moment");

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

function getTotalPLuginRecord(model, plugin) {
  return strapi.query(model, plugin).count();
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

function getErrorResponse(response) {
  return {
    result: {
      message: response
    }
  };
}

function sort(data, sort) {
  let sortByFields = [],
    orderByFields = [];

  sort.forEach(s => {
    sortByFields.push(s.field);
    orderByFields.push(s.order);
  });

  let result;
  if (sortByFields.length && orderByFields.length) {
    result = _.orderBy(data, sortByFields, orderByFields);
  } else {
    result = data;
  }
  return result;
}

function getMonthsBetweenDates(startDate, endDate, format) {
  let dates = [];
  let now = startDate ? moment(startDate, "dd-MM-yyyy").clone() : moment();
  const lastDate = endDate ? moment(endDate, "dd-MM-yyyy") : moment.now();
  const _format = format ? format : "M yyyy";

  while (now.isSameOrBefore(lastDate)) {
    dates.push(now.format(_format));
    now.add(1, "months");
  }
  return dates;
}

module.exports = {
  getRequestParams,
  getPaginatedResponse,
  getResponse,
  getFindOneResponse,
  getTotalRecords,
  getTotalPLuginRecord,
  asyncForEach,
  paginate,
  getErrorResponse,
  sort,
  merge: _.merge,
  getMonthsBetweenDates,
  lowerCase: _.lowerCase,
  head: _.head,
  last: _.last
};
