const mongoose = require('mongoose')
const uuid = require('node-uuid')

const modelName = 'Usuario'
const telefoneSchema = new mongoose.Schema({
  numero: String,
  ddd: String,
})

const usuarioSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v1(),
  },
  nome: String,
  email: String,
  senha: String,
  telefones: [telefoneSchema],
  data_criacao: {
    type: Date,
    default: Date.now(),
  },
  data_atualizacao: Date,
  ultimo_login: {
    type: Date,
    default: Date.now(),
  },
  token: String,

})

module.exports = mongoose.model(modelName, usuarioSchema)
