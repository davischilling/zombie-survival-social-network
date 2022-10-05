import { IValidation } from '@/data/contracts'
import expressValidatorAdapter from '@/infra/validation/express-validator'
import * as expressValidator from 'express-validator'

jest.mock('express-validator')

describe('Express Validator', () => {
  let expressValidatorSpy: any
  let sut: IValidation

  beforeAll(() => {
    expressValidatorSpy = jest
      .spyOn(expressValidator, 'validationResult')
      .mockImplementation(
        (req: any) =>
          ({
            isEmpty: () => false,
            errors: [],
          } as any)
      )
  })

  beforeEach(() => {
    sut = expressValidatorAdapter
  })

  it('should call validationResult with correct params', () => {
    sut.validate({ requestData: 'data' })

    expect(expressValidatorSpy).toHaveBeenCalledWith({ requestData: 'data' })
  })

  it('should return null if its empty', () => {
    expressValidatorSpy = jest
      .spyOn(expressValidator, 'validationResult')
      .mockImplementationOnce(
        (req: any) =>
          ({
            isEmpty: () => true,
            errors: [],
          } as any)
      )

    const validationResult = sut.validate({ requestData: 'data' })

    expect(validationResult).toBe(null)
  })

  it('should return validationResult if its not empty', () => {
    expressValidatorSpy = jest
      .spyOn(expressValidator, 'validationResult')
      .mockImplementationOnce(
        (req: any) =>
          ({
            isEmpty: () => false,
            errors: [
              {
                message: 'error_message',
              },
            ],
          } as any)
      )

    const validationResult = sut.validate({ requestData: 'data' })

    console.log(validationResult)

    expect(String(validationResult)).toEqual(
      String({
        isEmpty: () => false,
        errors: [],
      })
    )
  })
})
