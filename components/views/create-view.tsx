"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { AnimalFormData } from "@/types/animal"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"

export function CreateView() {
  const [formData, setFormData] = useState<AnimalFormData>({
    name: "",
    species: "",
    age: 0,
    isWild: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Validaciones
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" })
      setIsLoading(false)
      return
    }
    if (!formData.species.trim()) {
      setMessage({ type: "error", text: "La especie es requerida" })
      setIsLoading(false)
      return
    }
    if (formData.age < 0) {
      setMessage({ type: "error", text: "La edad debe ser un número positivo" })
      setIsLoading(false)
      return
    }

    try {
      // Generar ID único
      const newAnimal = {
        ...formData,
        id: `animal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      // Simular llamada a API (PUT /api/animals)
      console.log("[v0] Creating animal:", newAnimal)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: `Animal "${formData.name}" creado exitosamente con ID: ${newAnimal.id}` })

      // Limpiar formulario
      setFormData({
        name: "",
        species: "",
        age: 0,
        isWild: false,
      })
    } catch (error) {
      setMessage({ type: "error", text: "Error al crear el animal. Intenta nuevamente." })
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
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: León, Perro, Gato..."
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Especie</Label>
                <Input
                  id="species"
                  type="text"
                  placeholder="Ej: Panthera leo, Canis lupus..."
                  value={formData.species}
                  onChange={(e) => setFormData((prev) => ({ ...prev, species: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad (años)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                placeholder="0"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: Number.parseInt(e.target.value) || 0 }))}
                required
              />
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
