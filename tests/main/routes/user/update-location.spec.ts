import { UserModel } from '@/domain/models'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { faker } from '@faker-js/faker'
import request from 'supertest'

import { generateUser } from '../mocks/generateUser'

describe('Update User Location Route - PATCH /users/:id/location', () => {
  let user: UserModel

  beforeAll(async () => {
    user = generateUser()
  })

  beforeEach(async () => {
    await db.sync()
  })

  it('should return 404 and not_found error if user does not exist', async () => {
    const id = faker.datatype.uuid()

    const { statusCode, body } = await request(app)
      .patch(`/users/${id}/location`)
      .set('Accept', 'application/json')
      .send({
        location: {
          latitude: 36.076637,
          longitude: -95.903633,
        },
      })
    expect(statusCode).toBe(404)
    expect(body).toEqual({ error: 'not_found' })
  })

  it('should return 200 and a success message', async () => {
    const { id, ...userAttrs } = user

    await request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send(userAttrs)

    const users: any = await UserSchema.findAll()

    const { dataValues } = users[0]

    const { statusCode, body } = await request(app)
      .patch(`/users/${dataValues._id}/location`)
      .set('Accept', 'application/json')
      .send({
        location: {
          latitude: 36.076637,
          longitude: -95.903633,
        },
      })

    expect(statusCode).toBe(200)
    expect(body.message).toBe('Updated user location')

    const updatedSqliteUser: any = await UserSchema.findOne({
      where: { _id: dataValues._id },
    })
    const { dataValues: updatedUser } = updatedSqliteUser

    expect(updatedUser.latitude).toBe('36.076637')
    expect(updatedUser.longitude).toBe('-95.903633')
    expect(user.location.latitude).not.toBe(String('36.076637'))
    expect(user.location.longitude).not.toBe(String('-95.903633'))
  })
})
