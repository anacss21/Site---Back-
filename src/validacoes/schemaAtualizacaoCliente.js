const yup = require('./configuracoes');

const schemaAtualizacaoCliente = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  cpf: yup.string().required().max(14),
  telefone: yup.string().required().max(14),
  cep: yup.string().nullable().max(9),
  logradouro: yup.string().nullable(),
  complemento: yup.string().nullable(),
  bairro: yup.string().nullable(),
  cidade: yup.string().nullable(),
  estado: yup.string().nullable().max(2)
});

module.exports = schemaAtualizacaoCliente
