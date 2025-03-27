# VertsaPlayVacation

## Introdução

Este projeto é um exercício de web development onde é possível eftuar registos, login, visualizar os utilizadores, marcar férias e visualizar as mesmas.

## Requesitos

- Instalar **Node.js** (Fazer o download a partir do [website oficial](https://nodejs.org/en))
- Instalar **MariaDB** (Fazer o download a partir do [website oficial](https://mariadb.org))
- Instalar **VisualStudioCode** (Fazer o download a partir do [website oficial](https://code.visualstudio.com))

## Instalação

Para facilitar a instalação do projeto basta seguir os seguintes passos:

- No final da instalação de MariaDB, executar o ficheiro sql presente no repositório, se estiver a utilizar HeidiSQL apenas vá a Ficheiro -> Executar Ficheiro SQL... , selecione o ficheiro sql presente no repositório e por fim atualize as bases de dados mostradas com a tecla `f5`.
- No Visual Studio Code na pasta do repositório, abrir um terminal da cmd e executar os comandos:

```
npm install
npm install cors
```

- Criar um ficheiro na pasta do repositório com o nome `.env` e copiar o conteúdo do ficheiro `.envExemplo` e trocar DB_PASS_LOCAL pela palavra pass definida na instalação de MariaDB e por fim executar na cmd `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` e trocar SESSION_SECRET pelo valor obtido no comando anterior, isto garante que a informação da sessão esteja mais segura.
- Para iniciar o website apenas é necessário executar o comando `npm start` e aceder ao link mencionado na consola: `http://localhost:3000`.
