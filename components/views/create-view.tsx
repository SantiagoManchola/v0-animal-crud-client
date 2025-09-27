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
    id: 0,
    nombre: "",
    peso: 0,
    birthDateTime: "",
    isWild: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!formData.nombre.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" })
      setIsLoading(false)
      return
    }
    if (formData.id <= 0) {
      setMessage({ type: "error", text: "El ID debe ser un número positivo" })
      setIsLoading(false)
      return
    }
    if (formData.peso <= 0) {
      setMessage({ type: "error", text: "El peso debe ser mayor a 0 kg" })
      setIsLoading(false)
      return
    }
    if (!formData.birthDateTime) {
      setMessage({ type: "error", text: "La fecha y hora de nacimiento es requerida" })
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Creating animal:", formData)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: `Animal "${formData.nombre}" creado exitosamente con ID: ${formData.id}` })

      setFormData({
        id: 0,
        nombre: "",
        peso: 0,
        birthDateTime: "",
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
                <Label htmlFor="id">ID (Identificador)</Label>
                <Input
                  id="id"
                  type="number"
                  placeholder="Ej: 12345678"
                  value={formData.id || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, id: Number.parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: León, Perro, Gato..."
                  value={formData.nombre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
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
                  value={formData.peso || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, peso: Number.parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDateTime">Fecha y Hora de Nacimiento</Label>
                <Input
                  id="birthDateTime"
                  type="datetime-local"
                  value={formData.birthDateTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, birthDateTime: e.target.value }))}
                  required
                />
              </div>
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
