import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');


import App from '../app';
import MatchesModel from '../database/models/MatchModel';

import * as jwt from 'jsonwebtoken';
import { Response } from 'superagent';
import TeamModel from '../database/models/TeamModel';
import { mockJwtDecode } from './mocks/Login.mocks';
import { mockCreatedMatch, mockFindAllFinishedMatchesReturn, mockFindAllInProgressMatchesReturn, mockFindAllReturn, mockNewMatch } from './mocks/Match.mocks';
import { mockFindByIdReturn } from './mocks/Team.mocks';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

let chaiHttpResponse: Response;
const matchesRoute = '/matches'

describe('A rota GET /matches', () => {
  beforeEach(() => {
    sinon
    .stub(MatchesModel, "findAll")
    .resolves(mockFindAllReturn as unknown as MatchesModel[]);
  })

  afterEach(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  })

  it('Retorna um array contendo todos as partidas no banco de dados', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get(matchesRoute)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockFindAllReturn);
  });

  it('Quando a query string "inProgress" é true, retorna um array com as partidas em andamento', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get(matchesRoute)
      .query('inProgress=true')

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockFindAllInProgressMatchesReturn);
  });

  it('Quando a query string "inProgress" é false, retorna um array com as partidas finalizadas', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get(matchesRoute)
      .query('inProgress=false')

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockFindAllFinishedMatchesReturn);
  });

  it('Quando a query string "inProgress" é false, retorna um array com as partidas finalizadas', async () => {
    const badQueryErrorMessage = 'Invalid query'

    chaiHttpResponse = await chai
      .request(app)
      .get(matchesRoute)
      .query('inProgress=fsdfsdf')

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.have.ownProperty('message')
    expect(chaiHttpResponse.body.message).to.be.deep.equal(badQueryErrorMessage);
  });
});

describe('A rota POST /matches', () => {
  beforeEach(() => {
    sinon
    .stub(jwt, "verify")
    .resolves(mockJwtDecode as unknown);
  })

  afterEach(()=>{
    (jwt.verify as sinon.SinonStub).restore();
  })


  it('Não permite criar partidas quando o time da casa e o visitante são o mesmo', async () => {
    const expectedError = 'It is not possible to create a match with two equal teams'

    chaiHttpResponse = await chai
      .request(app)
      .post(matchesRoute)
      .send({
        "homeTeam": 1,
        "awayTeam": 1
      })
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(422);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(expectedError);
  });


  it('Não permite criar partidas se um dos times não existe', async () => {
    const expectedError = 'There is no team with such id!'

    sinon 
      .stub(TeamModel, "findByPk")
      .resolves(null)

    chaiHttpResponse = await chai
      .request(app)
      .post(matchesRoute)
      .send({
        "homeTeam": 1,
        "awayTeam": 99
      })
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(expectedError);

    (TeamModel.findByPk as sinon.SinonStub).restore();
  });


  it('Cria uma nova partida corretamente', async () => {
    sinon
      .stub(TeamModel, "findByPk")
      .resolves(mockFindByIdReturn as TeamModel);

    sinon
      .stub(MatchesModel, 'create')
      .resolves(mockCreatedMatch as MatchesModel)

    chaiHttpResponse = await chai
      .request(app)
      .post(matchesRoute)
      .send(mockNewMatch)
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(201);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockCreatedMatch);

    (TeamModel.findByPk as sinon.SinonStub).restore();
    (MatchesModel.create as sinon.SinonStub).restore();
  });
});

describe('A rota PATCH /matches/:id', () => {
  beforeEach(() => {
    sinon
    .stub(jwt, "verify")
    .resolves(mockJwtDecode as unknown);

    sinon
    .stub(MatchesModel, "findByPk")
    .resolves(mockFindByIdReturn as unknown as MatchesModel)
  })

  afterEach(()=>{
    (jwt.verify as sinon.SinonStub).restore();
    (MatchesModel.findByPk as sinon.SinonStub).restore();
  })


  it('Não permite atualizar uma partida que não existe', async () => {
    (MatchesModel.findByPk as sinon.SinonStub).restore();
    
    const expectedError = 'Match does not exist'

    sinon
      .stub(MatchesModel, "findByPk")
      .resolves(undefined)

    chaiHttpResponse = await chai
      .request(app)
      .patch(`${matchesRoute}/1`)
      .send({
        "homeTeamGoals": 3,
        "awayTeamGoals": 1
      })
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(expectedError);
  });

  it('Não permite atualizar uma partida sem enviar o número de gols do time da casa', async () => {
    const expectedError = 'Incorrect fields to update'

    chaiHttpResponse = await chai
      .request(app)
      .patch(`${matchesRoute}/1`)
      .send({
        "awayTeamGoals": 1
      })
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(expectedError);
  });

  it('Não permite atualizar uma partida sem enviar o número de gols do time visitante', async () => {
    const expectedError = 'Incorrect fields to update'

    chaiHttpResponse = await chai
      .request(app)
      .patch(`${matchesRoute}/1`)
      .send({
        "homeTeamGoals": 1
      })
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(expectedError);
  });

  it('Atualiza corretamente uma partida', async () => {   
    const okMessage = "Score updated"

    sinon
    .stub(MatchesModel, "update")
    .resolves()
    
    chaiHttpResponse = await chai
    .request(app)
    .patch(`${matchesRoute}/1`)
    .send({
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    })
    .set('authorization', 'V4l1D T0K3n')
    
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(okMessage);

    (MatchesModel.update as sinon.SinonStub).restore();
  });
});

describe('A rota PATCH /matches/:id/finish', () => {
  beforeEach(() => {
    sinon
    .stub(jwt, "verify")
    .resolves(mockJwtDecode as unknown);

    sinon
    .stub(MatchesModel, "findByPk")
    .resolves(mockFindByIdReturn as unknown as MatchesModel)
  })

  afterEach(()=>{
    (jwt.verify as sinon.SinonStub).restore();
    (MatchesModel.findByPk as sinon.SinonStub).restore();
  })


  it('Não permite atualizar uma partida que não existe', async () => {
    (MatchesModel.findByPk as sinon.SinonStub).restore();
    
    const expectedError = 'Match does not exist'

    sinon
      .stub(MatchesModel, "findByPk")
      .resolves(undefined)

    chaiHttpResponse = await chai
      .request(app)
      .patch(`${matchesRoute}/1/finish`)
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(expectedError);
  });

  it('Atualiza corretamente uma partida', async () => {   
    const okMessage = "Finished"

    sinon
    .stub(MatchesModel, "update")
    .resolves()
    
    chaiHttpResponse = await chai
    .request(app)
    .patch(`${matchesRoute}/1/finish`)
    .set('authorization', 'V4l1D T0K3n')
    
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    expect(chaiHttpResponse.body.message).to.be.equal(okMessage);

    (MatchesModel.update as sinon.SinonStub).restore();
  });
});