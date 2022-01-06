const knex = require('../conexao');
const schemaCadastroCliente = require('../validacoes/schemaCadastroCliente');
const schemaAtualizacaoCliente = require('../validacoes/schemaAtualizacaoCliente')

const cadastrarCliente = async (req, res) => {
  let {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    estado
  } = req.body;

  try {

    await schemaCadastroCliente.validate(req.body);

    const ConsultaEmail = await knex.column('email').select().from('clientes').where({ email }).first();

    if (ConsultaEmail) {
      return res.status(404).json({
        mensagem: 'E-mail informado já cadastrado.',
        sucesso: false
      });
    }

    const clienteNovo = await knex('clientes')
      .insert({
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado
      });

    if (!clienteNovo) {
      return res.status(500).json({
        mensagem: "Não foi possível cadastrar cliente",
        sucesso: false
      });
    }

    return res.status(200).json({
      mensagem: 'Cliente cadastrado com sucesso.',
      sucesso: true
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const listarClientes = async (req, res) => {

  try {

    const clientes = await knex('clientes');

    if (!clientes) {
      return res.status(404).json({
        mensagem: 'Cliente não encontrado.',
        sucesso: false
      });
    }

    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const detalharCliente = async (req, res) => {

  const { id } = req.params;

  try {
    const cliente = await knex('clientes').where({ id }).first();
    if (!cliente) {
      return res.status(404).json({
        mensagem: 'Cliente não encontrado.',
        sucesso: false
      });
    }
    return res.status(200).json(cliente);

  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
};

const atualizarCliente = async (req, res) => {

  const id = req.params.id;

  let {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    estado
  } = req.body;

  try {

    await schemaAtualizacaoCliente.validate(req.body);

    const clienteExiste = await knex.column('email', 'id').select().from('clientes').where({ id }).first();
    if (!clienteExiste) {
      return res.status(404).json({
        mensagem: 'Cliente não encontrado.',
        sucesso: false
      });
    }

    if (email !== clienteExiste.email) {

      const emailClienteExiste = await knex.column('email').select().from('clientes').where({ email }).first();

      if (emailClienteExiste) {
        return res.status(404).json({
          mensagem: 'E-mail informado já cadastrado.',
          sucesso: false
        });
      }
    }

    const clienteAtualizado = await knex('clientes').where({ id }).update({
      nome,
      email,
      cpf,
      telefone,
      cep,
      logradouro,
      complemento,
      bairro,
      cidade,
      estado
    });


    if (!clienteAtualizado) {
      return res.status(400).json({
        mensagem: "O cliente não foi atualizado",
        sucesso: false
      });
    }
    return res.status(200).json({
      mensagem: "Cliente foi atualizado com sucesso.",
      sucesso: true
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

module.exports = {
  cadastrarCliente,
  listarClientes,
  detalharCliente,
  atualizarCliente
};