const yup = require('./configuracoes')

const schemaCadastroCobrancas = yup.object().shape({
  cliente_id: yup.number().required(),
  descricao: yup.string().required(),
  vencimento: yup.string().required(),
  valor: yup.number().required(),
  status: yup.string().required()
})

module.exports = schemaCadastroCobrancas
