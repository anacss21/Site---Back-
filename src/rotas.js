const express = require('express');
const usuarios = require('./controladores/usuarios');
const clientes = require('./controladores/clientes');
const cobrancas = require('./controladores/cobrancas');
const autenticacao = require('./filtros/auth');

const rotas = express();

rotas.post('/usuario', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.login);
rotas.post('/email', usuarios.obterEmail)

rotas.use(autenticacao.validarToken);

rotas.get('/usuario', usuarios.obterUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);

rotas.post('/clientes', clientes.cadastrarCliente);
rotas.get('/clientes', clientes.listarClientes);
rotas.put('/clientes/:id', clientes.atualizarCliente)
rotas.get('/clientes/:id', clientes.detalharCliente)


rotas.post('/cobrancas', cobrancas.cadastrarCobranca);
rotas.get('/cobrancas', cobrancas.listarCobrancas);
rotas.get('/cobrancas/:id', cobrancas.listarCobrancasCliente);

rotas.get('/cobranca/:id', cobrancas.detalhesCobranca);
rotas.put('/cobrancas/:id', cobrancas.editarCobranca);
rotas.delete('/cobrancas/:id', cobrancas.excluirCobranca);

module.exports = rotas
