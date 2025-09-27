"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Animal } from "@/types/animal"
import { List, Filter, Play as Paw, TreePine, Home } from "lucide-react"

export function ListAllView() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([])
  const [filter, setFilter] = useState<"all" | "wild" | "domestic">("all")
  const [isLoading, setIsLoading] = useState(false)

  // Datos de ejemplo para demostración
  const mockAnimals: Animal[] = [
    { id: "animal_1", name: "León", species: "Panthera leo", age: 5, isWild: true },
    { id: "animal_2", name: "Perro", species: "Canis lupus familiaris", age: 3, isWild: false },
    { id: "animal_3", name: "Tigre", species: "Panthera tigris", age: 7, isWild: true },
    { id: "animal_4", name: "Gato", species: "Felis catus", age: 2, isWild: false },
    { id: "animal_5", name: "Elefante", species: "Loxodonta africana", age: 15, isWild: true },
  ]

  const fetchAnimals = async () => {
    setIsLoading(true)
    try {
      // Simular llamada a API (GET /api/animals?filter=...)
      console.log("[v0] Fetching animals with filter:", filter)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      setAnimals(mockAnimals)
    } catch (error) {
      console.error("Error fetching animals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals()
  }, [])

  useEffect(() => {
    // Aplicar filtro del lado del cliente (en producción sería del servidor)
    let filtered = animals
    if (filter === "wild") {
      filtered = animals.filter((animal) => animal.isWild)
    } else if (filter === "domestic") {
      filtered = animals.filter((animal) => !animal.isWild)
    }
    setFilteredAnimals(filtered)
  }, [animals, filter])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Lista de Animales</h1>
        <p className="text-muted-foreground">Visualiza todos los animales registrados en el sistema</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>Filtra los animales por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={(value: "all" | "wild" | "domestic") => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los animales</SelectItem>
                <SelectItem value="wild">Solo salvajes</SelectItem>
                <SelectItem value="domestic">Solo domésticos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnimals} disabled={isLoading}>
              {isLoading ? "Cargando..." : "Actualizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Animales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Animales Registrados
            <Badge variant="secondary" className="ml-2">
              {filteredAnimals.length} resultados
            </Badge>
          </CardTitle>
          <CardDescription>
            {filter === "all" && "Mostrando todos los animales"}
            {filter === "wild" && "Mostrando solo animales salvajes"}
            {filter === "domestic" && "Mostrando solo animales domésticos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando animales...</p>
            </div>
          ) : filteredAnimals.length === 0 ? (
            <div className="text-center py-8">
              <Paw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron animales con el filtro seleccionado</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAnimals.map((animal) => (
                <Card key={animal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {animal.isWild ? (
                          <TreePine className="h-5 w-5 text-green-600" />
                        ) : (
                          <Home className="h-5 w-5 text-blue-600" />
                        )}
                        <h3 className="font-semibold text-lg">{animal.name}</h3>
                      </div>
                      <Badge variant={animal.isWild ? "default" : "secondary"}>
                        {animal.isWild ? "Salvaje" : "Doméstico"}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Especie:</span>
                        <p className="text-muted-foreground italic">{animal.species}</p>
                      </div>
                      <div>
                        <span className="font-medium">Edad:</span>
                        <span className="text-muted-foreground ml-1">
                          {animal.age} {animal.age === 1 ? "año" : "años"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">ID:</span>
                        <span className="text-muted-foreground ml-1 font-mono text-xs">{animal.id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
