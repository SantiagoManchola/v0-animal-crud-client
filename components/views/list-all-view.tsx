"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Animal, Habitat } from "@/types"
import { fetchAnimals as fetchAnimalsAPI } from "@/lib/utils"
import { List, Filter, TreePine, Home, MapPin } from "lucide-react"

export function ListAllView() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [habitats, setHabitats] = useState<Habitat[]>([])
  const [filter, setFilter] = useState<"all" | "wild" | "no_wild">("all")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnimals(filter)
    fetchHabitats()
  }, [filter])

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

  const fetchHabitats = async () => {
    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habitats`)
      if (response.ok) {
        const data = await response.json()
        setHabitats(data)
      }
    } catch (error) {
      console.error('Error fetching habitats:', error)
    }
    */

    // Temporary: Mock data
    const mockHabitats: Habitat[] = [
      {
        id: 1001,
        name: "Sabana Africana",
        area: 2500.5,
        establishedDate: "2020-03-15T10:00:00",
        isVisitorAccessible: true,
        isCovered: false,
      },
      {
        id: 1002,
        name: "Bosque Tropical",
        area: 1800.75,
        establishedDate: "2019-07-22T14:30:00",
        isVisitorAccessible: true,
        isCovered: true,
      },
      {
        id: 1003,
        name: "Área de Cuarentena",
        area: 500.0,
        establishedDate: "2021-01-10T09:00:00",
        isVisitorAccessible: false,
        isCovered: true,
      },
      {
        id: 1004,
        name: "Acuario Principal",
        area: 3200.0,
        establishedDate: "2018-11-05T11:00:00",
        isVisitorAccessible: true,
        isCovered: true,
      },
    ]
    setHabitats(mockHabitats)
  }

  const getHabitatName = (habitatId: number) => {
    const habitat = habitats.find((h) => h.id === habitatId)
    return habitat ? habitat.name : "Sin habitat"
  }

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
                    <TableHead>Habitat</TableHead>
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
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {getHabitatName(animal.habitatId)}
                        </div>
                      </TableCell>
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
