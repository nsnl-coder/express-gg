const getControllerFileName = (singular) => `${singular}Controller.js`;
const getModelFileName = (singular) => `${singular}Model.js`;
const getRouterFileName = (singular) => `${singular}Routes.js`;
const getSchemaFileName = (singular) => `${singular}Schema.js`;

module.exports = {
  getControllerFileName,
  getModelFileName,
  getRouterFileName,
  getSchemaFileName,
};
