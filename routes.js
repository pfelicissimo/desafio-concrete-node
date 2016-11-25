const usuarioController = require('./controllers/usuario-controller')
const moment = require('moment')

const validateToken = (token) => {
  let tokenString

  if (token.indexOf('Bearer') === '' || token.indexOf('Bearer') === -1) {
    tokenString = null
  } else {
    tokenString = token.replace('Bearer ', '')
  }

  return tokenString
}

const setRoutes = (app) => {
  app.post('/api/usuario', (req, res) => {
    usuarioController.create(req.body)
            .then((result) => {
              res
                    .status(result.statusCode)
                    .json(result.data)
            })
            .catch((err) => {
              res
                    .status(err.statusCode)
                    .json({
                      mensagem: err.message,
                    })
            })
  })

  app.post('/api/login', (req, res) => {
    usuarioController.login(req.body)
            .then((result) => {
              res
                    .status(result.statusCode)
                    .json(result.data)
            })
            .catch((err) => {
              res
                    .status(err.statusCode)
                    .json({
                      mensagem: err.message,
                    })
            })
  })

  app.get('/api/usuario/:id', (req, res) => {
    let token = req.get('Authentication')
    token = validateToken(req.get('Authentication'))

    if (token) {
      usuarioController.get(req.params.id, token, moment(new Date()))
                .then((result) => {
                  res
                        .status(result.statusCode)
                        .json(result.data)
                })
                .catch((err) => {
                  res
                        .status(err.statusCode)
                        .json({
                          mensagem: err.message,
                        })
                })
    } else {
      res
                .status(401)
                .json({
                  mensagem: 'Não autorizado',
                })
    }
  })
}

exports.setRoutes = setRoutes
