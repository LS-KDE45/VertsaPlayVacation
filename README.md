# VertsaPlayVacation

## Introdução

Este projeto é um exercício de web development onde é possível eftuar registos, login, visualizar os utilizadores, marcar férias e visualizar as mesmas.
O projeto utiliza **Node.js** e **Express** para criar uma API, **MariaDB** para salvar os dados, **Sequelize** para assegurar um envio de dados seguro, **Handlebars** para mostrar todos os dados recebidos pela base de dados e para facilitar o uso de CSS também foi utilizado **Bootstrap**.

## Requesitos

- Instalar **Node.js** (Fazer o download a partir do [website oficial](https://nodejs.org/en))
- Instalar **MariaDB** (Fazer o download a partir do [website oficial](https://mariadb.org))
- Instalar **VisualStudioCode** (Fazer o download a partir do [website oficial](https://code.visualstudio.com))

## Instalação

Para facilitar a instalação do projeto basta seguir os seguintes passos:

- No final da instalação de MariaDB, executar o ficheiro sql presente no repositório, se estiver a utilizar HeidiSQL apenas vá a Ficheiro -> Executar Ficheiro SQL... , selecione o ficheiro sql presente no repositório e por fim atualize as bases de dados mostradas com a tecla `f5`.
- No Visual Studio Code na pasta do repositório, abrir um terminal da cmd e executar os comandos:

1. Instalar as dependências necessárias

```
npm install
```

2. É necessário também instalar Cors uma vez que não instala as dependências automaticamente

```
npm install cors
```

- Criar um ficheiro na pasta do repositório com o nome `.env` e copiar o conteúdo do ficheiro `.envExemplo` e trocar DB_PASS_LOCAL pela palavra pass definida na instalação de MariaDB, por fim executar na cmd `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` e trocar SESSION_SECRET pelo valor obtido no comando anterior, isto garante que a informação da sessão esteja mais segura.
- Para iniciar o website apenas é necessário executar o comando `npm start` e aceder ao link mencionado na consola: `http://localhost:3000`.

## Utilização

Quando se incia o website aparece a página principal que não apresenta nehnuma informação relevante, no entanto no cabeçalho aparece a opção de Login onde, caso não tenha sido criado nenhum utilizador é necessário usar as seguintes credenciais:

- Email: `admin@gmail.com`
- Senha: `admin`  
  Depois de efetuar o login já é possível utilizar todas as funcionalidades implementadas.

### Funcionalidade das Páginas

1. Mostrar Utilizadores
   - Esta página mostra toda a informação relevante de todos os utilizadores registados.
2. Mostrar Férias
   - Esta página mostra uma tabela com as datas de férias marcadas, para um utilizador admin mostra todas as férias marcadas por todos os utilizadores incluindo informação dos mesmos como o nome e email, para um utilizador normal apenas mostra as datas das suas férias.
3. Marcar Férias
   - Nesta página é possivel marcar as férias do utilizador atual através da escolha do dia de início e do dia de fim através do calendário. Não é possível selecionar datas inválidas tais como dias já passados e o próprio dia, e também não é possível escolher uma data de fim de férias menor que a de início.
4. Adicionar um Utilizador
   - Este link apenas é visível para utilizadores admin, e a página é utilizada para criar um novo utilizador, o admin adiciona informação necessária como o email, cargo e se este utilizador vai ser administrador ou não. Quando carrega no botão submeter é enviado um email automático para a nova conta com um link para este utilizador terminar o registo com campos para o nome telemóvel e senha.
5. Remover Utilizadores
   - Este link também é somente vísivel para utilizadores admin, aqui é possível remover utilizadores através de uma tabela semelhante à tabela presente na página Mostrar Utilizadores, porém esta tabela tem a adicão de um botão em cada linha que possibilita a remoção desse mesmo utilizador.
