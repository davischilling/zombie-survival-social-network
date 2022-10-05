import { ItemEnumTypes, ItemModel, ItemTypes, UserModel } from '@/domain/models'
import { ItemRepository, UserRepository } from '@/infra/db/repositories'
import { ItemSchema } from '@/infra/db/schemas/Item'
import { UserSchema } from '@/infra/db/schemas/User'
import { app } from '@/main/config/app'
import { db } from '@/main/config/database'
import { generateItem, generateUser } from '@/tests/main/routes/mocks'
import { faker } from '@faker-js/faker'
import request from 'supertest'

const createUser = async (idParam: string, isInfectedParam: boolean) => {
  const user: UserModel = generateUser(idParam, isInfectedParam)
  const { id: _id, location, ...userAttrs } = user
  const { latitude, longitude } = location

  const createdSqliteUser: any = await UserSchema.create({
    _id,
    latitude,
    longitude,
    ...userAttrs,
  })

  const { dataValues } = createdSqliteUser
  return UserRepository.sqliteToDTO(dataValues)
}

const createItem = async (
  userId?: string,
  points?: number,
  name?: ItemTypes
) => {
  const item: ItemModel = generateItem({ userId, points, name })
  const { id: _id, ...itemAttrs } = item
  console.log(item)

  const createdSqliteItem: any = await ItemSchema.create({
    _id,
    ...itemAttrs,
  })

  const { dataValues } = createdSqliteItem
  return ItemRepository.sqliteToDTO(dataValues)
}

describe('Survival Report Route - GET /survival-report', () => {
  beforeEach(async () => {
    await db.sync()
  })

  it('should return 200 and the survival report', async () => {
    const newUserOne = await createUser(faker.datatype.uuid(), false)
    const newUserTwo = await createUser(faker.datatype.uuid(), true)
    const newUserThree = await createUser(faker.datatype.uuid(), true)
    const newUserFour = await createUser(faker.datatype.uuid(), false)
    const newUserFive = await createUser(faker.datatype.uuid(), false)
    const newUserSix = await createUser(faker.datatype.uuid(), true)

    await createItem(newUserOne.id, 3, ItemEnumTypes.food)
    await createItem(newUserOne.id, 1, ItemEnumTypes.ammunition)
    await createItem(newUserTwo.id, 4, ItemEnumTypes.water)
    await createItem(newUserTwo.id, 2, ItemEnumTypes.medicine)
    await createItem(newUserTwo.id, 1, ItemEnumTypes.ammunition)
    await createItem(newUserTwo.id, 2, ItemEnumTypes.medicine)
    await createItem(newUserThree.id, 3, ItemEnumTypes.food)
    await createItem(newUserFour.id, 1, ItemEnumTypes.ammunition)
    await createItem(newUserFour.id, 4, ItemEnumTypes.water)
    await createItem(newUserFive.id, 3, ItemEnumTypes.food)
    await createItem(newUserFive.id, 1, ItemEnumTypes.ammunition)
    await createItem(newUserSix.id, 4, ItemEnumTypes.water)

    const { statusCode, body } = await request(app)
      .get('/survival-report')
      .set('Accept', 'application/json')

    console.log(body)

    expect(statusCode).toBe(200)
    expect(body).toEqual({
      averageItemPerUser: [
        {
          averageAmmunition: 0.5,
          averageFood: 0.5,
          averageMedicine: 0,
          averageWater: 0,
          username: newUserOne.name,
        },
        {
          averageAmmunition: 0.25,
          averageFood: 0,
          averageMedicine: 0.5,
          averageWater: 0.25,
          username: newUserTwo.name,
        },
        {
          averageAmmunition: 0,
          averageFood: 1,
          averageMedicine: 0,
          averageWater: 0,
          username: newUserThree.name,
        },
        {
          averageAmmunition: 0.5,
          averageFood: 0,
          averageMedicine: 0,
          averageWater: 0.5,
          username: newUserFour.name,
        },
        {
          averageAmmunition: 0.5,
          averageFood: 0.5,
          averageMedicine: 0,
          averageWater: 0,
          username: newUserFive.name,
        },
        {
          averageAmmunition: 0,
          averageFood: 0,
          averageMedicine: 0,
          averageWater: 1,
          username: newUserSix.name,
        },
      ],
      lostPointsByInfectedUser: 3,
      percentageOfInfectedUsers: 50,
      percentageOfNonInfectedUsers: 50,
    })
  })
})
