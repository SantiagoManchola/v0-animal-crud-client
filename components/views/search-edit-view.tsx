"use client"

import { useState } from "react"
import { SearchView } from "./search-view"
import { EditView } from "./edit-view"
import type { Animal } from "@/types/animal"

export function SearchEditView() {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)

  if (selectedAnimal) {
    return <EditView animal={selectedAnimal} onBack={() => setSelectedAnimal(null)} />
  }

  return (
    <SearchView
      onAnimalFound={setSelectedAnimal}
      title="Buscar Animal para Editar"
      description="Busca un animal por ID para modificar su información"
      actionLabel="Continuar a Edición"
    />
  )
}
