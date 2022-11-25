export const mockDatabaseUser = {
  id: 1,
  username: 'Teste',
  email: 'teste@teste.com',
  password: '123456',
  role: 'admin'
}

export const mockToken = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc"
}

export const mockLoginOK = {
  email: 'teste@teste.com',
  password: '123456'
}

export const mockLoginBadEmail = {
  email: 'teste@teste',
  password: '123456'
}

export const mockJwtDecode = {
  data: {
    dataValues: mockDatabaseUser
  }
}
