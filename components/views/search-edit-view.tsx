"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Animal, AnimalEditData } from "@/types/animal"
import { Search, Edit, AlertCircle, CheckCircle } from "lucide-react"

export function SearchEditView() {
  const [searchId, setSearchId] = useState("")
  const [foundAnimal, setFoundAnimal] = useState<Animal | null>(null)
  const [editData, setEditData] = useState<AnimalEditData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const mockAnimals: Animal[] = [
    { id: 12345, nombre: "León", peso: 190.5, birthDateTime: "2019-03-15T10:30", isWild: true },
    { id: 67890, nombre: "Perro", peso: 25.3, birthDateTime: "2021-07-22T14:15", isWild: false },
    { id: 11111, nombre: "Tigre", peso: 220.8, birthDateTime: "2017-11-08T09:45", isWild: true },
  ]

  const handleSearch = async () => {
    if (!searchId.trim() || isNaN(Number(searchId))) {
      setMessage({ type: "error", text: "Por favor ingresa un ID numérico válido" })
      return
    }

    setIsSearching(true)
    setMessage(null)
    setFoundAnimal(null)
    setEditData(null)

    try {
      console.log("[v0] Searching animal with ID:", Number(searchId))

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800))

      const animal = mockAnimals.find((a) => a.id === Number(searchId))

      if (animal) {
        setFoundAnimal(animal)
        setEditData({
          id: animal.id,
          nombre: animal.nombre,
          peso: animal.peso,
          birthDateTime: animal.birthDateTime,
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

    if (!editData.nombre.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" })
      return
    }
    if (editData.peso <= 0) {
      setMessage({ type: "error", text: "El peso debe ser mayor a 0 kg" })
      return
    }
    if (!editData.birthDateTime) {
      setMessage({ type: "error", text: "La fecha y hora de nacimiento es requerida" })
      return
    }

    setIsEditing(true)
    setMessage(null)

    try {
      console.log("[v0] Updating animal:", editData)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: `Animal "${editData.nombre}" actualizado exitosamente` })

      // Actualizar el animal encontrado
      setFoundAnimal({ ...editData })
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
            <CardDescription>Ingresa el ID numérico del animal que deseas editar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchId">ID del Animal</Label>
              <Input
                id="searchId"
                type="number"
                placeholder="Ej: 12345, 67890..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>

            <Button onClick={handleSearch} disabled={isSearching} className="w-full">
              {isSearching ? "Buscando..." : "Buscar Animal"}
            </Button>

            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">IDs de ejemplo para probar:</p>
              <div className="space-y-1">
                <button onClick={() => setSearchId("12345")} className="block hover:text-foreground transition-colors">
                  12345 (León)
                </button>
                <button onClick={() => setSearchId("67890")} className="block hover:text-foreground transition-colors">
                  67890 (Perro)
                </button>
                <button onClick={() => setSearchId("11111")} className="block hover:text-foreground transition-colors">
                  11111 (Tigre)
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
                <span className="ml-2">{foundAnimal.nombre}</span>
              </div>
              <div>
                <span className="font-medium">Peso:</span>
                <span className="ml-2">{foundAnimal.peso} kg</span>
              </div>
              <div>
                <span className="font-medium">Fecha de Nacimiento:</span>
                <span className="ml-2">{new Date(foundAnimal.birthDateTime).toLocaleString()}</span>
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
            <CardDescription>Modifica los campos que desees actualizar (el ID no se puede editar)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="editId">ID (Solo lectura)</Label>
                <Input id="editId" type="number" value={editData.id} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editNombre">Nombre</Label>
                <Input
                  id="editNombre"
                  type="text"
                  value={editData.nombre}
                  onChange={(e) => setEditData((prev) => (prev ? { ...prev, nombre: e.target.value } : null))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="space-y-2">
                <Label htmlFor="editPeso">Peso (kg)</Label>
                <Input
                  id="editPeso"
                  type="number"
                  step="0.1"
                  min="0"
                  value={editData.peso || ""}
                  onChange={(e) =>
                    setEditData((prev) => (prev ? { ...prev, peso: Number.parseFloat(e.target.value) || 0 } : null))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editBirthDateTime">Fecha y Hora de Nacimiento</Label>
                <Input
                  id="editBirthDateTime"
                  type="datetime-local"
                  value={editData.birthDateTime}
                  onChange={(e) => setEditData((prev) => (prev ? { ...prev, birthDateTime: e.target.value } : null))}
                />
              </div>
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
