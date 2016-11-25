const Usuario = require('./../models/usuarios')
const crypt = require('./../infra/crypt')
const configuration = require('./../config/config')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const notAuthorizedError = new Error('Não autorizado')
notAuthorizedError.statusCode = 401

const invalidSessionError = new Error('Sessão inválida')
invalidSessionError.statusCode = 401

const notFoundError = new Error('Usuário não encontrado')
notFoundError.statusCode = 404

const create = obj => Usuario.findOne({
  email: obj.email,
})
  .exec()
  .then((usuario) => {
    if (usuario) {
      const error = new Error('Já existe um usuário cadastrado com esse email')
      error.statusCode = 500

      throw error
    } else {
      const newUsuario = obj

      newUsuario.senha = crypt.createHash(newUsuario.senha)
      newUsuario.data_atualizacao = null
      return Usuario.create(newUsuario)
    }
  })
  .then((usuario) => {
    const createdUsuario = usuario

    const token = jwt.sign(createdUsuario, configuration.secret, {
      expiresIn: '1 day',
    })

    createdUsuario.token = token
    return createdUsuario.save()
  })
  .then(usuario => ({
    statusCode: 200,
    data: usuario,
  }))
  .catch(err => ({
    statusCode: err.statusCode,
    data: {
      mensagem: err.message,
    },
  }))

const login = obj => Usuario.findOne({
  email: obj.email,
})
  .exec()
  .then((usuario) => {
    if (usuario === null) {
      const error = new Error('Usuário e/ou senha inválidos')
      error.statusCode = 404

      throw error
    } else if (crypt.compare(obj.senha, usuario.senha)) {
      return {
        statusCode: 200,
        data: usuario,
      }
    } else {
      const error = new Error('Usuário e/ou senha inválidos')
      error.statusCode = 401

      throw error
    }
  })
  .catch((err) => {
    const statusCode = err.statusCode || 500
    const data = {
      mensagem: err.message,
    }

    return {
      statusCode,
      data,
    }
  })

const get = (_id, token, loginDate) => Usuario.findById(_id)
  .exec()
  .then((usuario) => {
    if (usuario === null) {
      throw notFoundError
    } else {
      const valid = usuario.token === token

      if (valid) {
        const lastLoginDate = moment(usuario.ultimo_login)
        const minutesDiff = loginDate.diff(lastLoginDate, 'minutes')

        if (minutesDiff > 30) {
          throw invalidSessionError
        } else {
          return {
            statusCode: 200,
            data: usuario,
          }
        }
      } else {
        throw notAuthorizedError
      }
    }
  })
  .catch((err) => {
    const statusCode = err.statusCode || 500
    const data = {
      mensagem: err.message || err,
    }

    return {
      statusCode,
      data,
    }
  })

exports.create = create
exports.login = login
exports.get = get
