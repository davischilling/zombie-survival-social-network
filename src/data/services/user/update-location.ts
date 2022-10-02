import { IRepository } from '@/data/contracts'
import {
  IUpdateUserLocationService,
  UpdateUserLocationUseCase,
} from '@/domain/use-cases/user'

export class UpdateUserLocationService implements IUpdateUserLocationService {
  constructor(private readonly userRepo: IRepository) {}

  async handle({
    id,
    location,
  }: UpdateUserLocationUseCase.input): Promise<void> {
    await this.userRepo.findById(id)
  }
}
