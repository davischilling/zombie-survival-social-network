import { UserModel } from '@/domain/models'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { faker } from '@faker-js/faker'
import request from 'supertest'

import { generateUser } from '../mocks/generateUser'

describe('Mark User as Infected Route - PATCH /users/:id/infected', () => {
  let user: UserModel

  beforeAll(async () => {
    user = generateUser()
  })

  beforeEach(async () => {
    await db.sync()
  })

  it('should return 404 and not_found error if user to update does not exist', async () => {
    const id = faker.datatype.uuid()

    const { statusCode, body } = await request(app)
      .patch(`/users/${id}/infected`)
      .set('Accept', 'application/json')
      .query({
        snitchOneId: faker.datatype.uuid(),
        snitchTwoId: faker.datatype.uuid(),
        snitchThreeId: faker.datatype.uuid(),
      })

    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'not_found' })
  })
})
