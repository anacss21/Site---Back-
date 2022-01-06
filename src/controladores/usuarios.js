const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schemaLogin = require('../validacoes/schemaLogin');
const schemaAtualizacao = require('../validacoes/schemaAtualizacao');
const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuario');
const tokenHash = require('../tokenHash');

const cadastrarUsuario = async (req, res) => {
  let { nome, email, senha } = req.body;

  try {

    await schemaCadastroUsuario.validate(req.body);

    const consultaEmail = await knex.column('email').select().from('usuarios').where("email", email).first();

    if (consultaEmail) {
      return res.status(404).json({
        mensagem: 'E-mail informado já cadastrado.',
        sucesso: false
      })
    }

    senha = await bcrypt.hash(senha, 10);

    const cadastro = await knex('usuarios')
      .insert({
        nome,
        email,
        senha
      });

    if (!cadastro) {
      return res.status(400).json({
        mensagem: "Não foi possível cadastrar o usuário.",
        sucesso: false
      });
    }

    return res.status(200).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      sucesso: true
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const login = async (req, res) => {

  const { email, senha } = req.body;

  try {

    await schemaLogin.validate(req.body);

    const usuario = await knex.column('senha', 'id', 'nome').select().from('usuarios').where("email", email).first();

    if (!usuario) {
      return res.status(400).json({
        mensagem: "Email e/ou senha invalidos.",
        sucesso: false
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({
        mensagem: "Email e/ou senha invalidos.",
        sucesso: false
      });
    }

    const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, tokenHash, { expiresIn: '8h' });

    return res.status(200).json({
      token
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const atualizarUsuario = async (req, res) => {
  let { nome, email, senha, cpf, telefone } = req.body;
  const { id } = req.usuario;

  try {

    await schemaAtualizacao.validate(req.body);

    const usuarioExiste = await knex.column('id').select().from('usuarios').where({ id }).first();

    if (!usuarioExiste) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado.',
        sucesso: false
      });
    }

    if (senha) {
      senha = await bcrypt.hash(senha, 10);
    }

    if (email !== req.usuario.email) {
      const emailUsuarioExiste = await knex.column('email').select().from('usuarios').where({ email }).first();

      if (emailUsuarioExiste) {
        return res.status(404).json({
          mensagem: 'E-mail informado já cadastrado.',
          sucesso: false
        });
      }
    }

    const usuarioAtualizado = await knex('usuarios')
      .where({ id })
      .update({
        nome,
        email,
        senha,
        cpf,
        telefone
      });

    if (!usuarioAtualizado) {
      return res.status(400).json({
        mensagem: "Não foi possível atualizar o usuário.",
        sucesso: false
      });
    }

    return res.status(200).json({
      mensagem: 'Usuário atualizado com sucesso.',
      sucesso: true
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: false
    });
  }
}

const obterUsuario = async (req, res) => {
  const { id } = req.usuario;

  try {

    const usuarioExiste = await knex.column("id", "nome", "email", "cpf", "telefone").select().from('usuarios').where({ id }).first();

    if (!usuarioExiste) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado.',
        sucesso: false
      });
    }

    // const { senha, ...usuario } = usuarioExiste;

    return res.status(200).json(usuarioExiste);
  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: true
    });
  }
}

const obterEmail = async (req, res) => {
  const { email } = req.body
  try {

    const emailExiste = await knex.column('email').select().from('usuarios').where({ email }).first();

    if (emailExiste) {
      return res.status(400).json({
        mensagem: 'E-mail informado já cadastrado.',
        sucesso: false
      });
    }

    return res.status(200).json({
      mensagem: "E-mail disponivel.",
      sucesso: true
    });

  } catch (error) {
    return res.status(400).json({
      mensagem: `Erro - ${error.message}.`,
      sucesso: true
    });
  }
}

module.exports = {
  login,
  atualizarUsuario,
  cadastrarUsuario,
  obterUsuario,
  obterEmail
}

