"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Animal } from "@/types/animal"
import { Search, Trash2, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

export function SearchDeleteView() {
  const [searchId, setSearchId] = useState("")
  const [foundAnimal, setFoundAnimal] = useState<Animal | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Datos de ejemplo para demostración
  const mockAnimals: Animal[] = [
    { id: "animal_1", name: "León", species: "Panthera leo", age: 5, isWild: true },
    { id: "animal_2", name: "Perro", species: "Canis lupus familiaris", age: 3, isWild: false },
    { id: "animal_3", name: "Tigre", species: "Panthera tigris", age: 7, isWild: true },
  ]

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setMessage({ type: "error", text: "Por favor ingresa un ID para buscar" })
      return
    }

    setIsSearching(true)
    setMessage(null)
    setFoundAnimal(null)
    setShowConfirmation(false)

    try {
      // Simular llamada a API (POST /api/animals/search)
      console.log("[v0] Searching animal with ID:", searchId)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      const animal = mockAnimals.find((a) => a.id === searchId)

      if (animal) {
        setFoundAnimal(animal)
        setMessage({ type: "success", text: "Animal encontrado. Revisa la información antes de eliminar." })
      } else {
        setMessage({ type: "error", text: "No se encontró ningún animal con ese ID" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al buscar el animal. Intenta nuevamente." })
    } finally {
      setIsSearching(false)
    }
  }

  const handleDelete = async () => {
    if (!foundAnimal) return

    setIsDeleting(true)
    setMessage(null)

    try {
      // Simular llamada a API (DELETE /api/animals/{id})
      console.log("[v0] Deleting animal with ID:", foundAnimal.id)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({
        type: "success",
        text: `Animal "${foundAnimal.name}" (ID: ${foundAnimal.id}) eliminado exitosamente`,
      })

      // Limpiar estado
      setFoundAnimal(null)
      setShowConfirmation(false)
      setSearchId("")
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar el animal. Intenta nuevamente." })
    } finally {
      setIsDeleting(false)
    }
  }

  const resetSearch = () => {
    setSearchId("")
    setFoundAnimal(null)
    setShowConfirmation(false)
    setMessage(null)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Buscar y Eliminar Animal</h1>
        <p className="text-muted-foreground">Busca un animal por ID y elimínalo del sistema</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Animal
            </CardTitle>
            <CardDescription>Ingresa el ID del animal que deseas eliminar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchId">ID del Animal</Label>
              <Input
                id="searchId"
                type="text"
                placeholder="Ej: animal_1, animal_2..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isSearching} className="flex-1">
                {isSearching ? "Buscando..." : "Buscar Animal"}
              </Button>
              <Button onClick={resetSearch} variant="outline">
                Limpiar
              </Button>
            </div>

            {/* IDs de ejemplo */}
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">IDs de ejemplo para probar:</p>
              <div className="space-y-1">
                <button
                  onClick={() => setSearchId("animal_1")}
                  className="block hover:text-foreground transition-colors"
                >
                  animal_1 (León)
                </button>
                <button
                  onClick={() => setSearchId("animal_2")}
                  className="block hover:text-foreground transition-colors"
                >
                  animal_2 (Perro)
                </button>
                <button
                  onClick={() => setSearchId("animal_3")}
                  className="block hover:text-foreground transition-colors"
                >
                  animal_3 (Tigre)
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Animal Encontrado */}
        {foundAnimal && (
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Animal a Eliminar
              </CardTitle>
              <CardDescription>Revisa cuidadosamente la información antes de eliminar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">ID:</span>
                  <span className="ml-2 font-mono text-sm">{foundAnimal.id}</span>
                </div>
                <div>
                  <span className="font-medium">Nombre:</span>
                  <span className="ml-2 text-lg font-semibold">{foundAnimal.name}</span>
                </div>
                <div>
                  <span className="font-medium">Especie:</span>
                  <span className="ml-2 italic">{foundAnimal.species}</span>
                </div>
                <div>
                  <span className="font-medium">Edad:</span>
                  <span className="ml-2">{foundAnimal.age} años</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tipo:</span>
                  <Badge variant={foundAnimal.isWild ? "default" : "secondary"}>
                    {foundAnimal.isWild ? "Salvaje" : "Doméstico"}
                  </Badge>
                </div>
              </div>

              {!showConfirmation ? (
                <Button onClick={() => setShowConfirmation(true)} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Animal
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>¿Estás seguro?</strong> Esta acción no se puede deshacer. El animal "{foundAnimal.name}"
                      será eliminado permanentemente del sistema.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button onClick={handleDelete} disabled={isDeleting} variant="destructive" className="flex-1">
                      {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                    </Button>
                    <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mensajes */}
      {message && (
        <Alert className={`mt-6 ${message.type === "error" ? "border-destructive" : "border-green-500"}`}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
