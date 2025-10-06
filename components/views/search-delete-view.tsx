"use client"

import { useState } from "react"
import { SearchView } from "./search-view"
import { DeleteView } from "./delete-view"
import type { Animal } from "@/types/animal"

export function SearchDeleteView() {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)

  const handleDeleted = () => {
    setSelectedAnimal(null)
  }

  if (selectedAnimal) {
    return <DeleteView animal={selectedAnimal} onBack={() => setSelectedAnimal(null)} onDeleted={handleDeleted} />
  }

  return (
    <SearchView
      onAnimalFound={setSelectedAnimal}
      title="Buscar Animal para Eliminar"
      description="Busca un animal por ID para eliminarlo del sistema"
      actionLabel="Continuar a Eliminación"
    />
  )
}
