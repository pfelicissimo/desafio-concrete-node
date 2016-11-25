const bcrypt = require('bcrypt-nodejs')

exports.createHash = string => bcrypt.hashSync(string, bcrypt.genSaltSync(10), null)

exports.compare = (string, hash) => bcrypt.compareSync(string, hash)
