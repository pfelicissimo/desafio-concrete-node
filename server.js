const app = require('./app')
const configuration = require('./config/config')

app.listen(configuration.port, () => {
  console.log('Escutando porta 8080')
})
