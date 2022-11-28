import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');


import App from '../app';
import MatchesModel from '../database/models/MatchModel';

import { Response } from 'superagent';
import { mockFindAllFinishedMatchesReturn, mockFindAllInProgressMatchesReturn, mockFindAllReturn } from './mocks/Match.mocks';

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
