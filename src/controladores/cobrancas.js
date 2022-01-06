const knex = require('../conexao');
const schemaCadastroCobrancas = require('../validacoes/schemaCadastroCobrancas');
const schemaAtualizacaoCobrancas = require('../validacoes/schemaAtualizacaoCobrancas');

const cadastrarCobranca = async (req, res) => {
  let { cliente_id, descricao, vencimento, valor, status } = req.body;

  try {
    await schemaCadastroCobrancas.validate(req.body);

    const novaCobranca = await knex('cobrancas')
      .insert({
        cliente_id,
        descricao,
        vencimento,
        valor,
        status
      });


    if (!novaCobranca) {
      return res.status(500).json({
        mensagem: "Não foi possível cadastrar a cobrança",
        sucesso: false
      });
    }

    return res.status(200).json({
      mensagem: 'Cobrança cadastrada com sucesso.',
      sucesso: true
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const listarCobrancas = async (req, res) => {

  try {

    const cobrancas = await knex.select(
      "clientes.nome",
      "cobrancas.cliente_id",
      "cobrancas.cobranca_id",
      "cobrancas.descricao",
      "cobrancas.vencimento",
      "cobrancas.valor",
      "cobrancas.status"
    ).from(
      "cobrancas"
    ).leftJoin(
      "clientes",
      "id",
      "cliente_id"
    );

    if (!cobrancas) {
      return res.status(404).json({
        mensagem: 'cobrancas não encontradas.',
        sucesso: false
      });
    }

    return res.status(200).json(cobrancas);
  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const listarCobrancasCliente = async (req, res) => {
  const { id } = req.params;

  try {

    const clienteExiste = await knex.select(
      "clientes.nome",
      "cobrancas.cliente_id",
      "cobrancas.cobranca_id",
      "cobrancas.descricao",
      "cobrancas.vencimento",
      "cobrancas.valor",
      "cobrancas.status"
    ).from(
      "cobrancas"
    ).leftJoin(
      "clientes",
      "id",
      "cliente_id"
    ).where(
      "cliente_id", id
    );

    if (!clienteExiste) {
      return res.status(404).json({
        mensagem: 'Cliente não encontrado.',
        sucesso: false
      });
    }

    return res.status(200).json(
      clienteExiste
    );

  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: true
    });
  }
}

const excluirCobranca = async (req, res) => {
  const { id } = req.params;

  try {

    const cobranca = await knex('cobrancas').del().where("cobranca_id", id);

    if (!cobranca) {
      return res.status(404).json({
        mensagem: 'cobrança não encontrada.',
        sucesso: false
      });
    }

    return res.status(200).json({
      mensagem: "Cobrança foi excluida com sucesso.",
      sucesso: true
    });

  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const editarCobranca = async (req, res) => {
  let { descricao, vencimento, valor, status } = req.body;
  let { id } = req.params;

  try {
    await schemaAtualizacaoCobrancas.validate(req.body);

    const cobrancaAtualizado = await knex('cobrancas').where("cobranca_id", id).update({
      descricao,
      vencimento,
      valor,
      status
    });

    if (!cobrancaAtualizado) {
      return res.status(400).json({
        mensagem: "A cobrança não foi atualizada",
        sucesso: false
      });
    }

    return res.status(200).json({
      mensagem: "Cobrança foi atualizada com sucesso.",
      sucesso: true
    });

  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
};

const detalhesCobranca = async (req, res) => {
  let { id } = req.params;

  try {
    const cobranca = await await knex.select(
      "clientes.nome",
      "cobrancas.cobranca_id",
      "cobrancas.descricao",
      "cobrancas.vencimento",
      "cobrancas.valor",
      "cobrancas.status"
    ).from(
      "cobrancas"
    ).leftJoin(
      "clientes",
      "id",
      "cliente_id"
    ).where(
      "cobranca_id", id
    )

    if (!cobranca) {
      return res.status(404).json({
        mensagem: 'cobrança não encontrado.',
        sucesso: false
      });
    }
    return res.status(200).json(cobranca);
  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

module.exports = {
  cadastrarCobranca,
  listarCobrancas,
  listarCobrancasCliente,
  detalhesCobranca,
  editarCobranca,
  excluirCobranca
}

