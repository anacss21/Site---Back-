const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const tokenHash = require('../tokenHash');

const validarToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem: "Para acessar este recurso o usuário deve estar logado.",
      sucesso: false
    });
  }

  try {
    const token = authorization.replace("Bearer", "").trim();

    const { id } = jwt.verify(token, tokenHash);

    const usuarioEncontrado = await knex.column('email', 'id').select().from('usuarios').where({ id }).first();

    if (!usuarioEncontrado) {
      return res.status(401).json({
        mensagem: "Usuário logado não encontrado.",
        sucesso: false
      });
    }

    req.usuario = usuarioEncontrado;

    return next();

  } catch (error) {

    return res.status(401).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

module.exports = { validarToken }