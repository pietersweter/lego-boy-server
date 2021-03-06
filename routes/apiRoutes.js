const mongoose = require('mongoose');
const Database = require('../services/Database');
const db = new Database();

const FANCY_TIMER = 1000;

module.exports = (app) => {

  app.get('/api/legoSets', (req, res) => {
    db.findLegoSets()
      .then(legoSets => {
        res.send(legoSets);
    });
  });

  app.get('/api/bricks', (req, res) => {
    db.findBricks()
      .then(bricks => {
        res.send(bricks);
    });
  });

  // TODO route for products/name

  app.get('/api/legoSet/:id', (req, res) => {
    const id = req.params.id;
    db.findLegoSetByID(id)
    .then(legoSet => {
      res.send(legoSet);
    });
  });

  app.get('/api/legoSets/name/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    db.findLegoSetByName(name)
    .then(legoSets => {
      res.send(legoSets);
    });
  });

  app.get('/api/brick/:id', (req, res) => {
    const id = req.params.id;
    db.findBrickByID(id)
    .then(brick => {
      res.send(brick);
    });
  });

  app.post('/api/increment', (req, res) => {
    let legoSetID = req.body.legoSetID;
    let brickID = req.body.brickID;

    db.incrementOwnedBricksNumber(legoSetID, brickID)
    .then(project => {
      res.send(project);
    });;
  });

  app.post('/api/decrement', (req, res) => {
    let legoSetID = req.body.legoSetID;
    let brickID = req.body.brickID;

    db.decrementOwnedBricksNumber(legoSetID, brickID)
    .then(project => {
      res.send(project);
    });
  });

  app.post('/api/activate', (req, res) => {
    let legoSetID = req.body.legoSetID;

    db.activateProject(legoSetID)
    .then(project => {
      res.send(project);
    });;
  });

  app.post('/api/deactivate', (req, res) => {
    let legoSetID = req.body.legoSetID;

    db.deactivateProject(legoSetID)
    .then(project => {
      res.send(project);
    });;
  });


  app.get('/api/project/:id', (req, res) => {
    db.findProjectByID(req.params.id)
    .then(project => {
      res.send(project);
    });
  });

  app.get('/api/projects', (req, res) => {
    db.findProjects()
    .then(projects => {
      res.send(projects);
    })
  });

  app.post('/api/activate', (req, res) => {
    let legoSetID = req.body.legoSetID;

    db.activateProject(legoSetID)
    .then(project => {
      res.send(project);
    });;
  });

  app.post('/api/project', (req, res) => {
    const newProject = {
      legoSetID: req.body.legoSetID,
      name: '',
      bricks: [],
      lastModified: new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }),
      isActive: true,
      isFavourite: false
    };
    db.findLegoSetByID(newProject.legoSetID)
    .then(legoSet => {
      if (!legoSet.length) {
        res.status(409).send({error: 'There is no such lego set with given project ID!'});
      } else {
        newProject.name = legoSet[0].name;
        legoSet[0].bricks.forEach(brick => {
          let tmpBrick = {};
          tmpBrick.brickID = brick.id;
          tmpBrick.name = legoSet[0].bricks.find(brick => brick.id === tmpBrick.brickID).name;
          tmpBrick.imageURL = legoSet[0].bricks.find(brick => brick.id === tmpBrick.brickID).imageURL;
          tmpBrick.ownedQuantity = 0;
          tmpBrick.requiredQuantity = legoSet[0].bricks.find(brick => brick.id === tmpBrick.brickID).quantity;
          newProject.bricks.push(tmpBrick);
        });
        db.findProjectByID(newProject.legoSetID)
        .then(project => {
          if (project.length) {
            res.status(409).send({error: 'Such project already exists!'});
          } else {
            console.log('nie wysyla promisa?');
            db.addProject(newProject)
            .then(() => {
              res.status(200).send({ message: 'Project successfully created.'});
            });
          }
        });
      }
    });
  });

  app.delete('/api/project', (req, res) => {
    const legoSetID =  req.body.legoSetID;
    db.findProjectByID(legoSetID)
      .then(project => {
        if (!project.length) {
          res.status(409).send({error: 'There is no such project!'});
        } else {
          db.removeProject(legoSetID)
          .then(() => {
            res.status(200).send({message: 'Project successfully deleted.'});
          });
        }
      });
  });

  app.get('/info', (req, res) => {
    res.send("<ul><li><h2>'/api/legoSets'</h2><h3> GET </h3><p> get all legoSets </p></li><li><h2>'/api/bricks'</h2><h3> GET </h3><p> get all bricks</p></li><li><h2>'/api/legoSet/:id'</h2><h3> GET </h3><p> get legoSet with given ID</p></li><li><h2>'/api/legoSets/name/:name </h2><h3> GET </h3><p> search legoSet by name </p></li><li><h2>'/api/brick/:id'</h2><h3> GET </h3><p> get brick with given ID </p></li><li><h2>'/api/project/:id'</h2><h3> GET </h3><p> get project with given ID </p></li><li><h2>'/api/projects'</h2><h3> GET<p> get all projects' </p></li><li><h2> /api/increment' </h2><h3> POST </h3><p> increment owned blocks for specific project <br/> in body include legoSetID and brickID </p></li><li><h2>'/api/decrement'</h2><h3> POST </h3><p> decrement owned blocks for specific project <br/> in body include legoSetID and brickID </p></li></ul>");
  })
};