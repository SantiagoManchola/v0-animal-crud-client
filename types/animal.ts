export interface Animal {
  id: number; // Numeric ID like cedula, can be set on create but not editable
  name: string;
  weight: number; // Weight in kg (double)
  birthDateTime: string; // Birth date and time
  isWild: boolean;
}

export type AnimalFormData = Animal;

export type AnimalEditData = Omit<Animal, "id"> & { id: number };
