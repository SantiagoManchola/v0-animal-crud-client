import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API base URL
const API_URL = "http://localhost:8080";

import type { Animal, AnimalFormData, AnimalEditData } from "../types/animal";

import type {
  Habitat,
  HabitatFormData,
  HabitatEditData,
} from "../types/habitat";

// Eliminar la declaración duplicada de fetchAnimals
export async function fetchAnimals(
  isWild: "all" | "wild" | "no_wild" = "all"
): Promise<Animal[] | null> {
  try {
    const url = `${API_URL}/animals?is_wild=${isWild}`;
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
    const res = await fetch(`${API_URL}/animals`, {
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
    const res = await fetch(`${API_URL}/animals/${data.id}`, {
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
    const res = await fetch(`${API_URL}/animals/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar animal");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createHabitat(
  data: HabitatFormData
): Promise<Habitat | null> {
  try {
    const res = await fetch(`${API_URL}/habitats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409) {
      return { error409: true } as any;
    }
    if (!res.ok) throw new Error("Error al crear hábitat");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateHabitat(
  data: HabitatEditData
): Promise<Habitat | null> {
  try {
    const res = await fetch(`${API_URL}/habitats/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al editar hábitat");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteHabitat(
  id: number
): Promise<boolean | { error409: true; message: string }> {
  try {
    const res = await fetch(`${API_URL}/habitats/${id}`, {
      method: "DELETE",
    });
    if (res.status === 409) {
      const errorData = await res.json();
      return {
        error409: true,
        message:
          errorData.message ||
          "No se puede eliminar el habitat porque está asociado a uno o más animales.",
      };
    }
    if (!res.ok) throw new Error("Error al eliminar hábitat");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fetchHabitats(
  isCovered?: "all" | "covered" | "not_covered"
): Promise<Habitat[] | null> {
  try {
    let url = `${API_URL}/habitats`;
    if (isCovered && isCovered !== "all") {
      const filterValue = isCovered === "covered" ? "true" : "false";
      url += `?is_covered=${filterValue}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener hábitats");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchHabitatById(id: number): Promise<Habitat | null> {
  try {
    const res = await fetch(`${API_URL}/habitats/${id}`);
    if (!res.ok) throw new Error("Error al obtener hábitat");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
