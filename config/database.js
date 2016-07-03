var
 variables =   require('../config/variables'),
 environment = variables.environment;

module.exports = {
  url: variables[environment].database
}
