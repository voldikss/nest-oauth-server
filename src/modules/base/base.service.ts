import { DeepPartial, FindConditions, Repository } from 'typeorm'

import { BaseEntity, BasePopulateSpec } from './base.entity'
import { StringKeyOf } from './types'

export abstract class BaseService<
  T extends BaseEntity = BaseEntity,
  POPULATE_SPEC extends BasePopulateSpec = BasePopulateSpec,
> {
  protected abstract readonly repository: Repository<T>

  async searchOne(
    conditions: FindConditions<T>,
    columns?: Array<StringKeyOf<T>>,
    populations?: Array<StringKeyOf<POPULATE_SPEC>>,
  ) {
    return await this.repository.findOne({
      where: conditions,
      select: columns,
      relations: populations,
    })
  }

  async createOne(input: DeepPartial<Omit<T, 'id'>>) {
    const instance = this.repository.create(input as any)
    return await this.repository.save(instance as any)
  }

  async updateOne(
    conditions: FindConditions<T>,
    input: DeepPartial<T>,
    { upsert }: { upsert: boolean },
  ) {
    const row = await this.repository.findOne({ where: conditions })
    if (!row && !upsert) {
      throw new Error('No rows found')
    }
    return await this.repository.save({ ...conditions, ...input })
  }

  async searchMany(
    conditions: FindConditions<T>,
    columns?: Array<StringKeyOf<T>>,
    populations?: Array<StringKeyOf<POPULATE_SPEC>>,
  ) {
    return await this.repository.find({
      where: conditions,
      select: columns,
      relations: populations,
    })
  }

  async createMany(inputs: Array<DeepPartial<Omit<T, 'id'>>>) {
    const instances = this.repository.create(inputs as any)
    return await this.repository.save(instances as any)
  }

  async updateMany(
    conditions: FindConditions<T>,
    input: DeepPartial<T>,
    { upsert }: { upsert: boolean },
  ) {
    const rows = await this.repository.find({ where: conditions })
    if (rows.length === 0 && !upsert) {
      throw new Error('No rows found')
    }
    return await this.repository.save(
      rows.map((x) => {
        return {
          ...x,
          ...input,
        }
      }),
    )
  }

  async searchByIds(
    ids: string[],
    columns?: Array<StringKeyOf<T>>,
    populations?: Array<StringKeyOf<POPULATE_SPEC>>,
  ) {
    return await this.repository.findByIds(ids, {
      select: columns,
      relations: populations,
    })
  }

  async updateByIds(
    ids: string[],
    input: DeepPartial<T>,
    { upsert }: { upsert: boolean },
  ) {
    const rows = await this.repository.findByIds(ids)
    if (rows.length === 0 && !upsert) {
      throw new Error('No rows found')
    }
    return await this.repository.save(
      rows.map((x) => {
        return {
          ...x,
          ...input,
        }
      }),
    )
  }

  async delete(conditions: FindConditions<T>) {
    return await this.repository.delete(conditions)
  }

  async count(conditions: FindConditions<T>) {
    return await this.repository.count(conditions)
  }
}
