"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Client = require('../models/Client'); var _Client2 = _interopRequireDefault(_Client);
var _Address = require('../models/Address'); var _Address2 = _interopRequireDefault(_Address);

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const userExist = await _User2.default.findOne({ where: { email: req.body.email } });
    if (userExist) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const { email, password } = req.body;

    const { id, provider } = await _User2.default.create({ email, password });
    return res.json({
      id,

      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword, password } = req.body;
    const user = await _User2.default.findByPk(req.userId);
    if (email && email !== user.email) {
      const userExist = await _User2.default.findOne({ where: { email } });

      if (userExist) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, provider } = await user.update({ password });

    return res.json({
      id,
      email,
      provider,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const user = await _User2.default.findByPk(id, {
      attributes: ['id', 'email', 'active'],
      include: [
        {
          attributes: ['id', 'name', 'cpf'],
          model: _Client2.default,
          as: 'client',
          include: [
            {
              attributes: [
                'id',
                'street',
                'number',
                'neighborhood',
                'cep',
                'complement',
                'state',
                'city',
                'delivery',
              ],
              model: _Address2.default,
              as: 'address',
            },
          ],
        },
      ],
    });

    res.json(user);
  }
}

exports. default = new UserController();
