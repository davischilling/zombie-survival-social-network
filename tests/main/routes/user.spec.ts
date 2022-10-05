import { UserModel } from '@/domain/models'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import request from 'supertest'

import { generateUser } from './mocks/generateUser'

describe('User Routes', () => {
  let user: UserModel

  beforeAll(async () => {})

  beforeEach(async () => {
    await db.sync()
    user = generateUser()
  })

  it('POST /users - should return 201 and success message', async () => {
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
    console.log(afterUserCreation)

    expect(afterUserCreation.length).toBe(1)
  })
})
