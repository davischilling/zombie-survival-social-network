import { UserModel } from '@/domain/models'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { faker } from '@faker-js/faker'
import request from 'supertest'

import { generateUser } from '../mocks/generateUser'

describe('Create User Route - POST /users', () => {
  let user: UserModel

  beforeAll(async () => {
    user = generateUser(faker.datatype.uuid(), faker.datatype.boolean())
  })

  beforeEach(async () => {
    await db.sync()
  })

  it('should return 201 and a success message', async () => {
    const users: any = await UserSchema.findAll()

    expect(users.length).toBe(0)

    const { id, ...userAttrs } = user
    const { statusCode, body } = await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send(userAttrs)

    expect(statusCode).toBe(201)
    expect(body.message).toBe('User created')

    const afterUserCreation: any = await UserSchema.findAll()

    expect(afterUserCreation.length).toBe(1)
  })
})
