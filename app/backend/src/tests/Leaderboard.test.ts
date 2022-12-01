import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');


import App from '../app';
import MatchesModel from '../database/models/MatchModel';

import { Response } from 'superagent';
import TeamModel from '../database/models/TeamModel';
import { mockFindAllTeamsAwayMatches, mockFindAllTeamsHomeMatches, mockReturnedAwayLeaderboard, mockReturnedFullLeaderboard, mockReturnedHomeLeaderboard } from './mocks/Leaderboard.mocks';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

let chaiHttpResponse: Response;
const leaderboardRoute = '/leaderboard'

describe('A rota GET /leaderboard/home', () => {
  afterEach(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
  })

  it('Retorna a classificação de acordo com as partidas em casa', async () => {
    sinon
    .stub(TeamModel, "findAll")
    .resolves(mockFindAllTeamsHomeMatches as unknown as MatchesModel[]);

    chaiHttpResponse = await chai
      .request(app)
      .get(`${leaderboardRoute}/home`)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockReturnedHomeLeaderboard);
    expect(chaiHttpResponse.body[0]).to.be.deep.equal(mockReturnedHomeLeaderboard[0])
  });
});

describe('A rota GET /leaderboard/away', () => {
  afterEach(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
  })

  it('Retorna a classificação de acordo com as partidas em casa', async () => {
    sinon
    .stub(TeamModel, "findAll")
    .resolves(mockFindAllTeamsAwayMatches as unknown as MatchesModel[]);

    chaiHttpResponse = await chai
      .request(app)
      .get(`${leaderboardRoute}/away`)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockReturnedAwayLeaderboard);
    expect(chaiHttpResponse.body[2]).to.be.deep.equal(mockReturnedAwayLeaderboard[2])
  });
});

describe('A rota GET /leaderboard', () => {
  afterEach(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
  })

  it('Retorna a classificação completa', async () => {
    sinon
    .stub(TeamModel, "findAll")
    .onFirstCall()
    .resolves(mockFindAllTeamsAwayMatches as unknown as MatchesModel[])
    .onSecondCall()
    .resolves(mockFindAllTeamsHomeMatches as unknown as MatchesModel[]);

    chaiHttpResponse = await chai
      .request(app)
      .get(leaderboardRoute)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(mockReturnedFullLeaderboard);
    expect(chaiHttpResponse.body[1]).to.be.deep.equal(mockReturnedFullLeaderboard[1])
  });
});