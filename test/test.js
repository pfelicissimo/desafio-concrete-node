const Usuario = require('./../models/usuarios')

describe('Teste de integração', () => {
  describe('Prova concrete', () => {
    let token = ''
    let _id = ''

    before((done) => {
      Usuario.findOneAndRemove({
        email: 'pfelicissimo@gmail.com',
      })
                .exec()
                .then(() => {
                  done()
                })
    })

    describe('Criação de cadastro', () => {
      it('deverá retornar objeto no formato esperado', (done) => {
        const testObject = {
          nome: 'Pablo Felicissimo',
          email: 'pfelicissimo@gmail.com',
          senha: 'concrete',
          telefones: [{
            numero: '123456789',
            ddd: '11',
          }],
        }

        request
                    .post('/api/usuario')
                    .send(testObject)
                    .end((err, res) => {
                      expect(res.status).to.be.eql(200)
                      expect(res.body).to.have.property('_id')
                      expect(res.body).to.have.property('data_criacao')
                      expect(res.body).to.have.property('data_atualizacao')
                      expect(res.body).to.have.property('ultimo_login')
                      expect(res.body).to.have.property('token')

                      expect(res.body.nome).to.be.eql(testObject.nome)

                      token = res.body.token
                      _id = res.body._id

                      done(err) // fim do teste
                    })
      })

      it('deverá retornar erro indicando email já cadastrado', (done) => {
        const testObject = {
          nome: 'Pablo Felicissimo',
          email: 'pfelicissimo@gmail.com',
          senha: 'concrete',
          telefones: [{
            numero: '123456789',
            ddd: '11',
          }],
        }

        request
                    .post('/api/usuario')
                    .send(testObject)
                    .end((err, res) => {
                      expect(res.status).to.be.eql(500)
                      expect(res.body).to.have.property('mensagem')
                      expect(res.body.mensagem).to.be.eql('Já existe um usuário cadastrado com esse email')

                      done(err) // fim do teste
                    })
      })
    })

    describe('Sign in', () => {
      it('deve efetuar o login com sucesso', ((done) => {
        const testObject = {
          email: 'pfelicissimo@gmail.com',
          senha: 'concrete',
        }

        request
                    .post('/api/login')
                    .send(testObject)
                    .end((err, res) => {
                      expect(res.status).to.be.eql(200)
                      expect(res.body).to.have.property('_id')
                      expect(res.body).to.have.property('data_criacao')
                      expect(res.body).to.have.property('data_atualizacao')
                      expect(res.body).to.have.property('ultimo_login')
                      expect(res.body).to.have.property('token')

                      expect(res.body.email).to.be.eql(testObject.email)


                      done(err) // fim do teste
                    })
      }))

      it('deve retornar erro de usuário não encontrado 404', ((done) => {
        const testObject = {
          email: 'pablofelicissimo@gmail.com',
          senha: 'concrete',
        }

        request
                    .post('/api/login')
                    .send(testObject)
                    .end((err, res) => {
                      expect(res.status).to.be.eql(404)
                      expect(res.body).to.have.property('mensagem')
                      expect(res.body.mensagem).to.be.eql('Usuário e/ou senha inválidos')

                      done(err) // fim do teste
                    })
      }))

      it('deve retornar erro de não autorizado 401', ((done) => {
        const testObject = {
          email: 'pfelicissimo@gmail.com',
          senha: 'concrete_2016',
        }

        request
                    .post('/api/login')
                    .send(testObject)
                    .end((err, res) => {
                      expect(res.status).to.be.eql(401)
                      expect(res.body).to.have.property('mensagem')
                      expect(res.body.mensagem).to.be.eql('Usuário e/ou senha inválidos')

                      done(err) // fim do teste
                    })
      }))
    })

    describe('Buscar usuário', () => {
      it('deve buscar o usuário corretamente', (done) => {
        request
                    .get(`/api/usuario/${_id}`)
                    .set('Authentication', `Bearer ${token}`)
                    .end((err, res) => {
                      expect(res.status).to.be.eql(200)
                      expect(res.body).to.have.property('_id')
                      expect(res.body).to.have.property('data_criacao')
                      expect(res.body).to.have.property('data_atualizacao')
                      expect(res.body).to.have.property('ultimo_login')
                      expect(res.body).to.have.property('token')

                      done(err) // fim do teste
                    })
      })
    })
  })
})
