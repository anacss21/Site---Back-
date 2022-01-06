const yup = require('./configuracoes');

const schemaAtualizacao = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  senha: yup.string().min(6),
  cpf: yup.string().nullable(),
  telefone: yup.string().nullable()
});

module.exports = schemaAtualizacao
