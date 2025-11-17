import { Animal } from "./animal";

export interface Keeper {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string; // formato "yyyy-MM-dd"
  specialization: string;
  isActive: boolean;
  yearsOfExperience: number;
}

export interface AnimalWithKeeper {
  animal: Animal;
  keeper: Keeper | null;
}

export interface KeeperFormData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  specialization: string;
  isActive: boolean;
  yearsOfExperience: number;
}

export interface AssignKeeperRequest {
  keeperId: number;
}
