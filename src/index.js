const express = require('express');
const {uuid, isUuid } = require('uuidv4');
const cors = require('cors');

const app = express();
app.use(express.json());
/**
 * Tipos de requisições
 *
 * GET: Busca uma informação no backend
 * POST: Criar uma informação no backend
 * PUT/DISPATH: Alterar uma informação no backend
 * DELETE: Apaga uma informação no backend
 */

 /**
  * Tipos de parâmetros
  *
  * Query Params: Filtros e paginação
  * Route Params: Indentificar recursos (Atualizar/Deletar)
  * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
  */

  /**
   * Middleware
   *
   * Interceptador de requisições que interrompe totalmente ou alterar os dados da requisição
   *
   */



  const repositories = [];

  function logRequests(req, res, next) {
    const { method, url } = req;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); // Executa o próximo middleware

    console.timeEnd(logLabel);
  }

  function validaterepositoryId(req, res, next) {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json( { error: 'Invalid repository ID.' });
    }

    return next();
  }

  app.use(logRequests);
  app.use(cors());
  app.use('/repositories/:id', validaterepositoryId)

  /**
   * req = request
   * res = response
   */
  app.get('/repositories', (req, res) => {
   const { title } = req.query;

   const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

    return res.status(200).json(results);
  });

  app.post('/repositories', (req, res) => {
    const { title, owner, url, techs } = req.body;

    const repository = { id: uuid(), title, owner, url, techs:[techs], likes: 0 };

    repositories.push(repository);

    return res.json(repository);
  });

  app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    (respository) => respository.id === id
  );

  if (findRepositoryIndex === -1)
    return response.status(400).json({ message: "Repository does not exist" });

  repositories[findRepositoryIndex].likes++;

  return response.json(repositories[findRepositoryIndex]);
});

  app.put('/repositories/:id', (req, res) => {
    const { id } = req.params;
    const { title, owner, url, techs } = req.body;

   const repositoryIndex = repositories.findIndex(repository => repository.id === id);

   if (repositoryIndex < 0) {
     return res.status(400).json({ error: 'repository not found.'});
   }

   const repository = {
     id,
     title,
     owner,
     url, 
     techs,
   };

   repositories[repositoryIndex] = repository;

    return res.json(repository);
  });

  app.delete('/repositories/:id', (req, res) => {
    const { id } = req.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

   if (repositoryIndex < 0) {
     return res.status(400).json({ error: 'repository not found.'});
   }

   repositories.splice(repositoryIndex, 1);

    return res.status(204).send();
  });

  app.listen(3333, () => {
    console.log(' 🚀 Backend started! 🦖');
  });
