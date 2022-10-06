# ZSSN (Zombie Survival Social Network)

### Descrição do Problema

O mundo finalmente atingiu o seu estado apocalíptico, onde uma pandemia causada por um virus de laboratório transforma seres humanos e animais em zumbis, seres sedentos por carne.

O sistema consiste em uma ***API REST***, que irá armazenar informações sobre os sobreviventes, bem como os recursos que cada um detem.

### Funcionalidades (endpoints)

O sistema conta com os seguintes endpoints:

- **Cadastro de usuários na base:**
  - POST /users

- **Atualização de localização de usuário:**
  - PATCH /users/:id/location

- **Marcação do usuário como infectado:**
  - PATCH /users/:id/infected

- **Adicionar/Remover itens do inventário de um usuário:**
  - POST /items/:userId
  - DELETE /items/:id

- **Escambo de bens:**
  - PATCH /items/exchange

- **Relatório:**
  - GET /survival-report

#### Setup da aplicação

  - Rodar comando no terminal para instalar os módulos da aplicação
    ```
      >> npm install
    ```
  - Script para rodar a aplicação
    ```
      >> npm run dev
    ```
  - Ao rodar a aplicação pela primeira vez, o arquivo zssn_db.sqlite será gerado no root do sistema. Para desenvolvimento da API, utilizei o Beekeeper Studio Ultimate, que ao selecinar o arquivo zssn_db.sqlite em uma nova conexão, permite visualizar os registros gerados.

  - BaseUrl da aplicação: http://localhost:3333

  - Acesso a documentação (swagger) da API: http://localhost:3333/api-docs

  - Ao acessar a documentação com a API rodando é possível visualizar os endpoints desenvolvidos, os dados que devem ser passados (body, params e query), fazer requisições e consultar todas as possíveis respostas de cada um dos endpoints.

#### Principais scripts de testes
  - Script para rodar todos os testes da aplicação
  ```
    >> npm run test
  ```
  - Script para a visualização da cobertura total de testes da aplicação
  ```
    >> npm run test:coverage
  ```

#### Decisões arquiteturais

  - Divisão da API em camadas:

    - Domain:
      - Implementação dos useCases de cada um dos endpoints da API, definindo assim os dados do request e response.
      - Definição dos models de cada entidade da aplicação.
    - Data:
      - Definição de contratos (interfaces que definem o comportamento de classes que adaptam.funcionalidades de bibliotecas de terceiros)
      - Entidades que implementam os modelos criados no domínio.
      - serviços que implementam o seu respectivo usecase e que através da injeção de dependências em seu construtor, utiliza de contratos para definir o seu comportamento desejado.
      - utils para o reaproveitamento de código entre serviços.
      - Implementação de erros para uma melhor semântica acerca dos possíveis erros utilizados pelos serviços.
    - Application:
      - controllers que através da injeção de dependência utilizam o seu respectivo serviço, passando os dados necessários para o funcionamento do serviço e assim repassando a resposta do serviço.
      - helpers utilizados para centralizar a lógica que define os possíveis responses da aplicação, assim como o seu statusCode e o dado ou erro a ser retornado.
      - utils utilizado para centralizar a forma como os controladores devem retornar o response  (statusCode e data) corretamente quando algum serviço der erro.
      - validações para serem utilizadas pela camada main da aplicação na parte das rotas
    - Infra:
      - Toda a camada de infra serve para implementar classes que com base nos contratos definidos da camada de dados, utilizam do adapter pattern  para utilizar bibliotecas de terceiros, moldando os dados com base nas necessidades da aplicação.
    - Main
      - Camada main que unifica toda a aplicação, sendo o ponto de partida e de configuração fundamentais para o funcionamento da API, como a definição de rotas e de acesso a documentação.
      - Foi utilizado o factory pattern para a instanciação das classes dos controladores, serviços e infra, injetando as dependências necessárias para o funcionamento de cada uma delas.
      - Foi implementado também um adaptador do express, para passar os dados da requisição para os controladores que foram gerados no factory.

Made by Davi Schilling