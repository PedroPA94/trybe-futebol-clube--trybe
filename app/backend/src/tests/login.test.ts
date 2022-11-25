import * as bcrypt from 'bcryptjs';
import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');


import App from '../app';
import UserModel from '../database/models/UserModel';

import * as jwt from 'jsonwebtoken';
import { Response } from 'superagent';
import { mockDatabaseUser, mockJwtDecode, mockLoginBadEmail, mockLoginOK, mockToken } from './mocks/login.mocks';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

let chaiHttpResponse: Response;
const loginRoute = '/login'
const noInputFieldMessage = 'All fields must be filled'
const invalidEmailOrPasswordMessage = 'Incorrect email or password'

describe('A rota POST /login', () => {
  beforeEach(async () => {
    sinon
      .stub(UserModel, "findOne")
      .resolves(mockDatabaseUser as UserModel);
    sinon
      .stub(jwt, 'sign')
      .resolves(mockToken)
  });

  afterEach(()=>{
    (UserModel.findOne as sinon.SinonStub).restore();
    (jwt.sign as sinon.SinonStub).restore();
  })

  it('Retorna um token JWT ao realizar login com informações corretas', async () => {
    sinon
      .stub(bcrypt, 'compareSync')
      .returns(true)

    chaiHttpResponse = await chai
      .request(app)
      .post(loginRoute)
      .send(mockLoginOK)

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('token');
    expect(chaiHttpResponse.body.token).to.be.deep.equal(mockToken);

    (bcrypt.compareSync as sinon.SinonStub).restore();
  });

  it('Não permite acesso sem email', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post(loginRoute)
        .send({ password: '123456' })

      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.haveOwnProperty('message');
      expect(chaiHttpResponse.body.message).to.be.equal(noInputFieldMessage);
  });

  it('Não permite acesso sem senha', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post(loginRoute)
      .send({ email: 'teste@teste.com' })

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.equal(noInputFieldMessage);
  });

  it('Não permite acesso com email inválido', async () => {
    (UserModel.findOne as sinon.SinonStub).restore()

    sinon
      .stub(UserModel, "findOne")
      .resolves();

    chaiHttpResponse = await chai
      .request(app)
      .post(loginRoute)
      .send(mockLoginBadEmail)

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.equal(invalidEmailOrPasswordMessage);
  });


  it('Não permite acesso com senha inválida', async () => {
    sinon
      .stub(bcrypt, 'compareSync')
      .returns(false)

    chaiHttpResponse = await chai
      .request(app)
      .post(loginRoute)
      .send(mockLoginBadEmail)

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.equal(invalidEmailOrPasswordMessage);

    (bcrypt.compareSync as sinon.SinonStub).restore();
  });
});

describe('A rota GET /login/validate', () => {
  it('Não permite acessar sem um token', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', '')

    expect(chaiHttpResponse.status).to.be.equal(401)
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.equal('Token not found');
  });

  it('Não permite acessar com um token inválido', async () => {
    sinon
      .stub(jwt, 'verify')
      .throws()

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', '123456')

    expect(chaiHttpResponse.status).to.be.equal(401)
    expect(chaiHttpResponse.body).to.haveOwnProperty('message');
    expect(chaiHttpResponse.body.message).to.be.equal('Token must be a valid token');

    (jwt.verify as sinon.SinonStub).restore();
  });

  it('Permite acessar com um token válido', async () => {
    sinon
      .stub(jwt, 'verify')
      .returns(mockJwtDecode as unknown as void)

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', 'V4l1D T0K3n')

    expect(chaiHttpResponse.status).to.be.equal(200)
    expect(chaiHttpResponse.body).to.haveOwnProperty('role');
    expect(chaiHttpResponse.body.role).to.be.equal('admin');

    (jwt.verify as sinon.SinonStub).restore();
  });
})
