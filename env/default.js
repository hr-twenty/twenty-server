module.exports = {
  rootPath: require('path').normalize(__dirname + '/..'),
  databaseUri: 'http://localhost:7474/',
  port: process.env.PORT || 3000
};
