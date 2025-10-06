"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Animal } from "@/types/animal"
import { fetchAnimals as fetchAnimalsAPI } from "@/lib/utils"
import { List, Filter, TreePine, Home } from "lucide-react"

export function ListAllView() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [filter, setFilter] = useState<"all" | "wild" | "no_wild">("all")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnimals = async (selectedFilter: "all" | "wild" | "no_wild" = filter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAnimalsAPI(selectedFilter)
      if (!data) {
        setError("No se pudo obtener la lista de animales del servidor.")
        setAnimals([])
      } else {
        setAnimals(data)
      }
    } catch (err) {
      setError("Error al obtener animales.")
      setAnimals([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals(filter)
  }, [filter])

  const filteredAnimals = animals

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Lista de Animales</h1>
        <p className="text-muted-foreground">Visualiza todos los animales registrados en el sistema</p>
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
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
            <Select value={filter} onValueChange={(value: "all" | "wild" | "no_wild") => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los animales</SelectItem>
                <SelectItem value="wild">Salvajes</SelectItem>
                <SelectItem value="no_wild">No salvajes</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => fetchAnimals(filter)} disabled={isLoading}>
              {isLoading ? "Cargando..." : "Actualizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

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
            {filter === "no_wild" && "Mostrando solo animales no salvajes"}
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
              <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron animales con el filtro seleccionado</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Peso (kg)</TableHead>
                    <TableHead>Fecha de Nacimiento</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnimals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell className="font-mono text-sm">{animal.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {animal.isWild ? (
                            <TreePine className="h-4 w-4 text-green-600" />
                          ) : (
                            <Home className="h-4 w-4 text-blue-600" />
                          )}
                          {animal.name}
                        </div>
                      </TableCell>
                      <TableCell>{animal.weight}</TableCell>
                      <TableCell>{new Date(animal.birthDateTime).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={animal.isWild ? "default" : "secondary"}>
                          {animal.isWild ? "Salvaje" : "No salvaje"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
