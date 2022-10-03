export interface IRepository<T = any> {
  create: (params: any) => Promise<string>
  find: (params: any) => Promise<{ items: number; data: T[] }>
  findById: (id: string) => Promise<T | null>
  findOneByParam: (params: any) => Promise<T | null>
  findByIdAndUpdate: (id: string, updatedObj: any) => Promise<string>
  findByIdAndDelete: (id: string) => Promise<void>
}
