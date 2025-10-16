"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AnimalFormData, Habitat } from "@/types/animal"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"
import { createAnimal } from "@/lib/utils"

export function CreateView() {
  const [formData, setFormData] = useState<AnimalFormData>({
    id: 0,
    name: "",
    weight: 0,
    birthDateTime: "",
    isWild: false,
    habitatId: 0,
  })
  const [habitats, setHabitats] = useState<Habitat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  useEffect(() => {
    fetchHabitats()
  }, [])

  const fetchHabitats = async () => {
    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habitats`);
      if (response.ok) {
        const data = await response.json();
        setHabitats(data);
      }
    } catch (error) {
      console.error('Error fetching habitats:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" })
      setIsLoading(false)
      return
    }
    if (formData.id <= 0) {
      setMessage({ type: "error", text: "El ID debe ser un número positivo" })
      setIsLoading(false)
      return
    }
    if (formData.weight <= 0) {
      setMessage({ type: "error", text: "El peso debe ser mayor a 0 kg" })
      setIsLoading(false)
      return
    }
    if (!formData.birthDateTime) {
      setMessage({
        type: "error",
        text: "La fecha y hora de nacimiento es requerida",
      })
      setIsLoading(false)
      return
    }
    if (formData.habitatId <= 0) {
      setMessage({
        type: "error",
        text: "Debes seleccionar un habitat",
      })
      setIsLoading(false)
      return
    }

    try {
      let birthDateTime = formData.birthDateTime
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(birthDateTime)) {
        birthDateTime += ":00"
      }
      const result = await createAnimal({ ...formData, birthDateTime })
      if (result && (result as any).error409) {
        setMessage({
          type: "error",
          text: "Ya existe un animal con ese ID. Por favor usa otro número.",
        })
      } else if (result) {
        setMessage({
          type: "success",
          text: `Animal "${result.name}" creado exitosamente con ID: ${result.id}`,
        })
        setFormData({
          id: 0,
          name: "",
          weight: 0,
          birthDateTime: "",
          isWild: false,
          habitatId: 0,
        })
      } else {
        setMessage({
          type: "error",
          text: "Error al crear el animal. Intenta nuevamente.",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al crear el animal. Intenta nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crear Nuevo Animal</h1>
        <p className="text-muted-foreground">Completa el formulario para agregar un nuevo animal al sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Información del Animal
          </CardTitle>
          <CardDescription>Todos los campos son obligatorios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">ID (Identificador)</Label>
                <Input
                  id="id"
                  type="number"
                  placeholder="Ej: 12345678"
                  value={formData.id || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      id: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: León, Perro, Gato..."
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ej: 25.5"
                  value={formData.weight || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weight: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDateTime">Fecha y Hora de Nacimiento</Label>
                <Input
                  id="birthDateTime"
                  type="datetime-local"
                  value={formData.birthDateTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      birthDateTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="habitat">Habitat</Label>
              <Select
                value={formData.habitatId.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    habitatId: Number.parseInt(value) || 0,
                  }))
                }
              >
                <SelectTrigger id="habitat">
                  <SelectValue placeholder="Selecciona un habitat" />
                </SelectTrigger>
                <SelectContent>
                  {habitats.map((habitat) => (
                    <SelectItem key={habitat.id} value={habitat.id.toString()}>
                      {habitat.name} - {habitat.area.toFixed(2)} m²
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isWild"
                checked={formData.isWild}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isWild: checked }))}
              />
              <Label htmlFor="isWild">¿Es un animal salvaje?</Label>
            </div>

            {message && (
              <Alert className={message.type === "error" ? "border-destructive" : "border-green-500"}>
                {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Animal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
