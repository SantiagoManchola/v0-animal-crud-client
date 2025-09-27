export interface Animal {
  id: string
  name: string
  species: string
  age: number
  isWild: boolean
}

export type AnimalFormData = Omit<Animal, "id">
