"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _StockController = require('../../app/controllers/StockController'); var _StockController2 = _interopRequireDefault(_StockController);

exports. default = routes => {
  // Routes Public
  routes.get('/stock/:id', _StockController2.default.show);
};
