# Driven-MyWallet-Back <img width="60" height="60" src="https://em-content.zobj.net/thumbs/120/google/350/money-with-wings_1f4b8.png"/>
Projeto _fullstack_ para construção de uma aplicação de transações monetárias.<br>
Repositório _back-end_ para desenvolvimento da API.
## Requisitos Obrigatórios ⚠️

### Geral:
- **Deploy do projeto back-end e do banco de dados na nuvem**.
- Utilização de coleções do banco de dados MongoDb.
- Arquiteturar o projeto em _controllers_, _middlewares_ e _routers_.
- Validação de dados utilizando a dependência _joi_.
- Criptografia de senhas utilizando a dependência _bcrypt_.
- _Token_ de sessão para controle de acesso de usuários logados.
- Logout para remover o token de sessão.

### Armazenamento dos Dados:
- Formato geral dos dados:

``` javascript
LoginSchema = {
  email: 'email do usuário',
  password: 'senha do usuário' 
};

RegisterSchema = {
  name: 'nome do usuário',
  email: 'email do usuário',
  password: 'senha do usuário',
  confirmPassword: 'confirmação de senha do usuário'
}

SessionSchema = {
  userID: `ID do usuário`,
  token: `token do usuário`
}

TransactionSchema = {
  userID: `ID do usuário`,
  total: `saldo total das transações do usuário`,
  transactions: [
    {
      value: `valor da transação`,
      description: `descrição da transação`,
      date: `dia que a transação foi feita (DD:MM)`,
      type: `tipo da transação: entrada (transação positiva) - saida (transação negativa)`
    }
  ]
}
```

## Rotas ⚙️
### AuthRoute 🚩
### /
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **email** e **password** pelo _body_, verifica se o usuário é valído no banco de dados e, em caso de sucesso, cria um token de sessão para o usuário.
<br>
### /cadastro
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **name, email, password** e **confirmPassword** pelo _body_, salva o usuário no banco de dados e redireciona para a página de Login.
<br>
### TransactionRoute 🚩
### /home
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna a lista de transações feitas e o saldo total para o usuário.<br>
### /nova-transacao/:type
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **value** e **description** pelo _body_ e **token** pelo _header, salva a transação no banco de dados e redireciona para a página Home.<br>
### /deletar-transacao/:index
![](https://place-hold.it/80x20/ec2626/ffffff?text=DELETE&fontsize=16) Recebe **index** por _params_ e deleta uma transação de acordo com o índice do array de transações.<br>
### /editar-registro/:type/:index
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Recebe **index** por _params_ e retorna uma transação de acordo com o índice do array de transações.<br>
### /editar-registro/:type/:index
![](https://place-hold.it/80x20/ec7926/ffffff?text=PUT&fontsize=16) Recebe **index** por _params_ e edita uma transação de acordo com o índice do array de transações.<br>
<br>
## Middlewares 🔛

### AuthMiddleware:
- Realiza a verificação de usuário autentificado através do **token** de sessão pelo _header_ da requisição.
- Cria o campo req.sessionID que contém o identificador da sessão.
- Rotas que utilizam este _middleware_:
  - Todas as rotas do **TransactionRoute**.

### TransactionByIndex:
- Verifica se o indice recebido por _params_ é válido.
- Cria o campo req.transactionDB que contém o documento do usuário requerido.
- Atualiza o campo req.data.index convertendo o tipo da variável indice para _number_.
- Rotas que utilizam este _middleware_:
  - **TransactionRoute**:
    - ![](https://place-hold.it/80x20/ec2626/ffffff?text=DELETE&fontsize=16) **/deletar-transacao/:index**
    - ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) **/editar-registro/:type/:index**

### Validation:
- Recebe um _Schema_ por parámetro de função e realiza as verificações dos dados recebidos pelo _body_ e _params_.
- Realiza a sanitização dos dados.
- Cria o campo req.data com os dados sanitizados.
- Rotas que utilizam este _middleware_:
  - **TransactionRoute**:
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/nova-transacao/:type**
    - ![](https://place-hold.it/80x20/ec2626/ffffff?text=DELETE&fontsize=16) **/deletar-transacao/:index**
    - ![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) **/editar-registro/:type/:index**
    - ![](https://place-hold.it/80x20/ec7926/ffffff?text=PUT&fontsize=16) **/editar-registro/:type/:index**
