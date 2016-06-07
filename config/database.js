var variables = require('../config/variables')
var environment = variables.environment

module.exports = {
  url: variables[environment].database
}
