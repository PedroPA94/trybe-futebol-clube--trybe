import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');


import App from '../app';
import TeamModel from '../database/models/TeamModel';

import { Response } from 'superagent';
import { mockFindAllReturn, mockFindByIdReturn } from './mocks/Team.mocks';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

let chaiHttpResponse: Response;
const teamsRoute = '/teams'

describe('A rota GET /teams', () => {
  beforeEach(async () => {
    sinon
      .stub(TeamModel, "findAll")
      .resolves(mockFindAllReturn as TeamModel[]);
  });

  afterEach(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
  })

  it('Retorna um array contendo todos os times no banco de dados', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get(teamsRoute)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockFindAllReturn);
  });
});

describe('A rota GET /teams/:id', () => {
  it('Retorna um objeto contendo o time referente ao id passado', async () => {
    sinon
      .stub(TeamModel, "findByPk")
      .resolves(mockFindByIdReturn as TeamModel);

    chaiHttpResponse = await chai
      .request(app)
      .get(`${teamsRoute}/1`)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockFindByIdReturn);

    (TeamModel.findByPk as sinon.SinonStub).restore();
  });

  it('Dispara um erro caso o id seja inválido', async () => {
    sinon
      .stub(TeamModel, "findByPk")
      .resolves();

    const notFoundErrorMessage = 'Team not found';

    chaiHttpResponse = await chai
      .request(app)
      .get(`${teamsRoute}/999`)

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.deep.equal(notFoundErrorMessage);

    (TeamModel.findByPk as sinon.SinonStub).restore();
  })
});