"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Animal, AnimalFormData } from "@/types/animal"
import { Search, Edit, AlertCircle, CheckCircle } from "lucide-react"

export function SearchEditView() {
  const [searchId, setSearchId] = useState("")
  const [foundAnimal, setFoundAnimal] = useState<Animal | null>(null)
  const [editData, setEditData] = useState<AnimalFormData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
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
    setEditData(null)

    try {
      // Simular llamada a API (POST /api/animals/search)
      console.log("[v0] Searching animal with ID:", searchId)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      const animal = mockAnimals.find((a) => a.id === searchId)

      if (animal) {
        setFoundAnimal(animal)
        setEditData({
          name: animal.name,
          species: animal.species,
          age: animal.age,
          isWild: animal.isWild,
        })
        setMessage({ type: "success", text: "Animal encontrado exitosamente" })
      } else {
        setMessage({ type: "error", text: "No se encontró ningún animal con ese ID" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al buscar el animal. Intenta nuevamente." })
    } finally {
      setIsSearching(false)
    }
  }

  const handleEdit = async () => {
    if (!foundAnimal || !editData) return

    // Validaciones
    if (!editData.name.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" })
      return
    }
    if (!editData.species.trim()) {
      setMessage({ type: "error", text: "La especie es requerida" })
      return
    }
    if (editData.age < 0) {
      setMessage({ type: "error", text: "La edad debe ser un número positivo" })
      return
    }

    setIsEditing(true)
    setMessage(null)

    try {
      // Simular llamada a API (PUT /api/animals/{id})
      console.log("[v0] Updating animal:", { ...editData, id: foundAnimal.id })

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: `Animal "${editData.name}" actualizado exitosamente` })

      // Actualizar el animal encontrado
      setFoundAnimal({ ...foundAnimal, ...editData })
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar el animal. Intenta nuevamente." })
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Buscar y Editar Animal</h1>
        <p className="text-muted-foreground">Busca un animal por ID y edita su información</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Animal
            </CardTitle>
            <CardDescription>Ingresa el ID del animal que deseas editar</CardDescription>
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

            <Button onClick={handleSearch} disabled={isSearching} className="w-full">
              {isSearching ? "Buscando..." : "Buscar Animal"}
            </Button>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Animal Encontrado
              </CardTitle>
              <CardDescription>Información actual del animal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">ID:</span>
                <span className="ml-2 font-mono text-sm">{foundAnimal.id}</span>
              </div>
              <div>
                <span className="font-medium">Nombre:</span>
                <span className="ml-2">{foundAnimal.name}</span>
              </div>
              <div>
                <span className="font-medium">Especie:</span>
                <span className="ml-2 italic">{foundAnimal.species}</span>
              </div>
              <div>
                <span className="font-medium">Edad:</span>
                <span className="ml-2">{foundAnimal.age} años</span>
              </div>
              <div>
                <span className="font-medium">Tipo:</span>
                <span className="ml-2">{foundAnimal.isWild ? "Salvaje" : "Doméstico"}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Formulario de Edición */}
      {editData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Información
            </CardTitle>
            <CardDescription>Modifica los campos que desees actualizar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editName">Nombre</Label>
                <Input
                  id="editName"
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editSpecies">Especie</Label>
                <Input
                  id="editSpecies"
                  type="text"
                  value={editData.species}
                  onChange={(e) => setEditData((prev) => (prev ? { ...prev, species: e.target.value } : null))}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="editAge">Edad (años)</Label>
              <Input
                id="editAge"
                type="number"
                min="0"
                value={editData.age}
                onChange={(e) =>
                  setEditData((prev) => (prev ? { ...prev, age: Number.parseInt(e.target.value) || 0 } : null))
                }
              />
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="editIsWild"
                checked={editData.isWild}
                onCheckedChange={(checked) => setEditData((prev) => (prev ? { ...prev, isWild: checked } : null))}
              />
              <Label htmlFor="editIsWild">¿Es un animal salvaje?</Label>
            </div>

            <Button onClick={handleEdit} disabled={isEditing} className="w-full mt-6">
              {isEditing ? "Actualizando..." : "Actualizar Animal"}
            </Button>
          </CardContent>
        </Card>
      )}

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
