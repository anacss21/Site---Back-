const yup = require('./configuracoes')

const schemaAtualizacaoCobrancas = yup.object().shape({
  descricao: yup.string().required(),
  vencimento: yup.string().required(),
  valor: yup.number().required(),
  status: yup.string().required()
})

module.exports = schemaAtualizacaoCobrancas
