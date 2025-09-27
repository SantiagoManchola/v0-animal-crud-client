import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API base URL
const API_URL = "http://localhost:8080/animals";

import type { Animal, AnimalFormData, AnimalEditData } from "../types/animal";

// Eliminar la declaración duplicada de fetchAnimals
export async function fetchAnimals(isWild: "all" | "wild" | "no_wild" = "all"): Promise<Animal[] | null> {
  try {
    const url = `${API_URL}?is_wild=${isWild}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener animales");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createAnimal(
  data: AnimalFormData
): Promise<Animal | null> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409) {
      return { error409: true } as any;
    }
    if (!res.ok) throw new Error("Error al crear animal");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateAnimal(
  data: AnimalEditData
): Promise<Animal | null> {
  try {
    const res = await fetch(`${API_URL}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al editar animal");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteAnimal(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar animal");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
