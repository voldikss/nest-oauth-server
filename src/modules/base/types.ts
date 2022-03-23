export type StringKeyOf<T> = Extract<keyof T, string>

export type Nullable<T> = T | null | undefined

export type PopulatedEntityType<
  Entity,
  Column extends keyof Entity,
  PopulateSpec,
  Population extends StringKeyOf<PopulateSpec>,
> = Pick<Entity, Column> & Pick<PopulateSpec, Population>
