export interface Habitat {
  id: number
  name: string
  area: number // Area in square meters (double)
  establishedDate: string // LocalDateTime
  isVisitorAccessible: boolean
  isCovered: boolean
}

export type HabitatFormData = Habitat

export type HabitatEditData = Omit<Habitat, "id"> & { id: number }
