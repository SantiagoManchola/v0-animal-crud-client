import type { Animal } from "./animal";

export interface Habitat {
  id: number;
  name: string;
  area: number; // Area in square meters (double)
  establishedDate: string; // LocalDateTime
  isCovered: boolean;
  animals?: Animal[]; // Array of animals in this habitat (for master-detail views)
}

export type HabitatFormData = Habitat;

export type HabitatEditData = Omit<Habitat, "id"> & { id: number };
