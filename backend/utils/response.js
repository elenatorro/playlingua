var ResponseCodes = require('../constants/response-codes');

module.exports = {
  setJsonHeader: function (response) {
    response.setHeader('Content-Type', 'application/json;  charset=utf-8');
  },

  send: function (response, data, status) {
    status = status || ResponseCodes.SUCCESS;
    response.status(status).end(JSON.stringify(data));
  }
};
