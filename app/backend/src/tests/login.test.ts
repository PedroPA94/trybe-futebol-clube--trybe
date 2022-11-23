import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import UserModel from '../database/models/UserModel';

import * as jwt from 'jsonwebtoken';
import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

const mockDatabaseUser = {
  id: 1,
  username: 'Teste',
  password: '123456',
  role: 'admin'
}

const mockToken = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc"
}

const mockLogin = {
  username: 'Teste',
  password: '123456'
}

describe('A rota de login', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(UserModel, "findOne")
      .resolves(mockDatabaseUser as UserModel);
    sinon
      .stub(jwt, 'sign')
      .resolves(mockToken)
  });

  after(()=>{
    (UserModel.findOne as sinon.SinonStub).restore();
  })

  it('POST - Retorna um token JWT ao realizar login com informações corretas', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(mockLogin)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('token');
    expect(chaiHttpResponse.body.token).to.be.deep.equal(mockToken);
  });
});
