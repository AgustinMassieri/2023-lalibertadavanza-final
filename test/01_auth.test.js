const request = require('supertest');
const app = require('../app');
const { usersModel } = require("../models");

beforeAll(async () => {
    await usersModel.deleteMany({});
});

test("Esto deberia retornar un 404", async() => {
    const response = await request(app)
    .post('/api/auth/login')
    .send(
        {
            "email":"noexiste@esteusuario.com",
            "password":"error"
        }
    )
    expect(response.statusCode).toEqual(404);
})

test("Se creo el usuario correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "adminuser@admin.com",
            "password": "adminuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70"
        }
    )
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .post('/api/auth/login')
    .send(
        {
            "email":"adminuser@admin.com",
            "password":"adminuser"
        }
    )
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 401, ya que la password no es correcta", async() => {
    const response = await request(app)
    .post('/api/auth/login')
    .send(
        {
            "email":"adminuser@admin.com",
            "password":"error"
        }
    )
    expect(response.statusCode).toEqual(401);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .get('/api/auth/users')
    expect(response.statusCode).toEqual(200);
})

test("Esto deberia retornar un 200", async() => {
    const response = await request(app)
    .get('/api/auth/users')
    expect(response.statusCode).toEqual(200);
})

test("Se creo y actualizo el usuario correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "testuser@gmail.com",
            "password": "testuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70"
        }
    )
    expect(response.statusCode).toEqual(200);

    const responseParsed = JSON.parse(response.text);

    const response1 = await request(app)
    .put('/api/auth/users/' + responseParsed.user._id)
    .send(
        {
            "firstName": "testNuevo"
        }
    )
    expect(response1.statusCode).toEqual(200);
})

test("Se creo y obtuvo el usuario correctamente", async() => {
    const response = await request(app)
    .post('/api/auth/register')
    .send(
        {
            "firstName": "test",
            "lastName": "user",
            "email": "testuser1@gmail.com",
            "password": "testuser",
            "sex": "male",
            "age": "23",
            "height": "1.80",
            "weight": "70"
        }
    )
    expect(response.statusCode).toEqual(200);

    const responseParsed = JSON.parse(response.text);
    const response1 = await request(app)
    .get('/api/auth/users/' + responseParsed.user._id)
    expect(response1.statusCode).toEqual(200);
})