"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, TreePine } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { HabitatFormData } from "@/types/habitat"

export function CreateHabitatView() {
  const [formData, setFormData] = useState<HabitatFormData>({
    id: 0,
    name: "",
    area: 0,
    establishedDate: "",
    isVisitorAccessible: false,
    isCovered: false,
  })
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habitats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create habitat')
      }
      
      const data = await response.json()
      console.log('Habitat created:', data)
      setSuccess(true)
      
      // Reset form
      setFormData({
        id: 0,
        name: "",
        area: 0,
        establishedDate: "",
        isVisitorAccessible: false,
        isCovered: false,
      })
    } catch (error) {
      console.error('Error creating habitat:', error)
    }
    */

    // Temporary: Simulate success
    console.log("Habitat created (simulated):", formData)
    setSuccess(true)

    // Reset form
    setTimeout(() => {
      setFormData({
        id: 0,
        name: "",
        area: 0,
        establishedDate: "",
        isVisitorAccessible: false,
        isCovered: false,
      })
      setSuccess(false)
    }, 2000)
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <TreePine className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crear Habitat</h1>
            <p className="text-muted-foreground">Registra un nuevo habitat en el sistema</p>
          </div>
        </div>

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">Habitat creado exitosamente!</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Información del Habitat</CardTitle>
            <CardDescription>Completa todos los campos para registrar el habitat</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id">ID (Identificador Numérico)</Label>
                <Input
                  id="id"
                  type="number"
                  placeholder="Ej: 12345"
                  value={formData.id || ""}
                  onChange={(e) => setFormData({ ...formData, id: Number.parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Habitat</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Sabana Africana"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.01"
                  placeholder="Ej: 1500.50"
                  value={formData.area || ""}
                  onChange={(e) => setFormData({ ...formData, area: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="establishedDate">Fecha y Hora de Establecimiento</Label>
                <Input
                  id="establishedDate"
                  type="datetime-local"
                  value={formData.establishedDate}
                  onChange={(e) => setFormData({ ...formData, establishedDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isVisitorAccessible">Accesible para Visitantes</Label>
                  <p className="text-sm text-muted-foreground">¿Los visitantes pueden acceder a este habitat?</p>
                </div>
                <Switch
                  id="isVisitorAccessible"
                  checked={formData.isVisitorAccessible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisitorAccessible: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isCovered">Habitat Cubierto</Label>
                  <p className="text-sm text-muted-foreground">¿El habitat tiene techo o cobertura?</p>
                </div>
                <Switch
                  id="isCovered"
                  checked={formData.isCovered}
                  onCheckedChange={(checked) => setFormData({ ...formData, isCovered: checked })}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Crear Habitat
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
