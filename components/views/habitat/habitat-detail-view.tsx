"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, TreePine, CheckCircle2, XCircle, AlertCircle, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Habitat } from "@/types/habitat"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export function HabitatDetailView() {
  const [habitatId, setHabitatId] = useState<string>("")
  const [habitat, setHabitat] = useState<Habitat | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    const id = parseInt(habitatId)
    if (isNaN(id) || id <= 0) {
      setError("Por favor ingresa un ID válido")
      return
    }

    setLoading(true)
    setError("")
    setHasSearched(true)

    try {
      const response = await fetch(`${API_URL}/habitats/${id}/with-animals`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Habitat no encontrado")
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setHabitat(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar el habitat")
      setHabitat(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateTimeString
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🏞️ Detalle de Habitat con Animales</h1>
        <p className="text-muted-foreground">Vista Maestro-Detalle: Consulta un habitat y visualiza todos sus animales</p>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Habitat
          </CardTitle>
          <CardDescription>Ingresa el ID del habitat para ver sus detalles y animales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="habitatId">ID del Habitat</Label>
              <Input
                id="habitatId"
                type="number"
                placeholder="Ej: 1"
                value={habitatId}
                onChange={(e) => {
                  setHabitatId(e.target.value)
                  setHasSearched(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results - Habitat Details (Master) */}
      {hasSearched && !loading && habitat && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Información del Habitat
              </CardTitle>
              <CardDescription>Datos maestros del habitat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-mono font-semibold">{habitat.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nombre</Label>
                  <p className="font-semibold text-lg">{habitat.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Área (m²)</Label>
                  <p className="font-semibold">{habitat.area.toLocaleString("es-ES")} m²</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Fecha de Establecimiento</Label>
                  <p className="font-semibold">{formatDateTime(habitat.establishedDate)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Tipo</Label>
                  <div>
                    <Badge variant={habitat.isCovered ? "default" : "secondary"}>
                      {habitat.isCovered ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Cubierto
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Descubierto
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Total de Animales</Label>
                  <p className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {habitat.animals?.length || 0} animal(es)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animals Table (Detail) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Animales en este Habitat
              </CardTitle>
              <CardDescription>
                {habitat.animals && habitat.animals.length > 0
                  ? `Lista detallada de ${habitat.animals.length} animal(es) que habitan aquí`
                  : "Este habitat no tiene animales registrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {habitat.animals && habitat.animals.length > 0 ? (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Peso (kg)</TableHead>
                        <TableHead>Fecha de Nacimiento</TableHead>
                        <TableHead>Salvaje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {habitat.animals.map((animal) => (
                        <TableRow key={animal.id}>
                          <TableCell className="font-mono">{animal.id}</TableCell>
                          <TableCell className="font-semibold">{animal.name}</TableCell>
                          <TableCell>{animal.weight.toFixed(1)} kg</TableCell>
                          <TableCell>{formatDateTime(animal.birthDateTime)}</TableCell>
                          <TableCell>
                            <Badge variant={animal.isWild ? "destructive" : "secondary"}>
                              {animal.isWild ? "Salvaje" : "Doméstico"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Este habitat no tiene animales registrados</p>
                  <p className="text-sm mt-2">Los animales aparecerán aquí una vez sean asignados a este habitat</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* No Results */}
      {hasSearched && !loading && !habitat && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <TreePine className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground">No se encontró ningún habitat con ese ID</p>
            <p className="text-sm text-muted-foreground mt-2">Verifica el ID e intenta nuevamente</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
