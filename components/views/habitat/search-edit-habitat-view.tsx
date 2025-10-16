"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Edit, CheckCircle2, TreePine } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { Habitat, HabitatEditData } from "@/types/habitat"

export function SearchEditHabitatView() {
  const [searchId, setSearchId] = useState("")
  const [habitat, setHabitat] = useState<Habitat | null>(null)
  const [editData, setEditData] = useState<HabitatEditData | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSearch = async () => {
    if (!searchId) return

    setLoading(true)
    setHabitat(null)
    setEditData(null)
    setSuccess(false)

    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habitats/${searchId}`)
      
      if (!response.ok) {
        throw new Error('Habitat not found')
      }
      
      const data = await response.json()
      setHabitat(data)
      setEditData({
        id: data.id,
        name: data.name,
        area: data.area,
        establishedDate: data.establishedDate,
        isVisitorAccessible: data.isVisitorAccessible,
        isCovered: data.isCovered,
      })
    } catch (error) {
      console.error('Error fetching habitat:', error)
    } finally {
      setLoading(false)
    }
    */

    // Temporary: Mock data
    const mockHabitat: Habitat = {
      id: Number.parseInt(searchId),
      name: "Sabana Africana",
      area: 2500.5,
      establishedDate: "2020-03-15T10:00:00",
      isVisitorAccessible: true,
      isCovered: false,
    }

    setHabitat(mockHabitat)
    setEditData({
      id: mockHabitat.id,
      name: mockHabitat.name,
      area: mockHabitat.area,
      establishedDate: mockHabitat.establishedDate,
      isVisitorAccessible: mockHabitat.isVisitorAccessible,
      isCovered: mockHabitat.isCovered,
    })
    setLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editData) return

    setSuccess(false)

    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habitats/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update habitat')
      }
      
      const data = await response.json()
      console.log('Habitat updated:', data)
      setSuccess(true)
    } catch (error) {
      console.error('Error updating habitat:', error)
    }
    */

    // Temporary: Simulate success
    console.log("Habitat updated (simulated):", editData)
    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Edit className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Buscar y Editar Habitat</h1>
            <p className="text-muted-foreground">Busca un habitat por ID para editarlo</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Habitat
            </CardTitle>
            <CardDescription>Ingresa el ID del habitat que deseas editar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Ej: 1001"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading || !searchId}>
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">Habitat actualizado exitosamente!</AlertDescription>
          </Alert>
        )}

        {habitat && editData && (
          <Card>
            <CardHeader>
              <CardTitle>Editar Habitat</CardTitle>
              <CardDescription>Modifica los campos que desees actualizar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-id">ID (No editable)</Label>
                  <Input id="edit-id" type="number" value={editData.id} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre del Habitat</Label>
                  <Input
                    id="edit-name"
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-area">Área (m²)</Label>
                  <Input
                    id="edit-area"
                    type="number"
                    step="0.01"
                    value={editData.area}
                    onChange={(e) => setEditData({ ...editData, area: Number.parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-establishedDate">Fecha y Hora de Establecimiento</Label>
                  <Input
                    id="edit-establishedDate"
                    type="datetime-local"
                    value={editData.establishedDate}
                    onChange={(e) => setEditData({ ...editData, establishedDate: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-isVisitorAccessible">Accesible para Visitantes</Label>
                    <p className="text-sm text-muted-foreground">¿Los visitantes pueden acceder?</p>
                  </div>
                  <Switch
                    id="edit-isVisitorAccessible"
                    checked={editData.isVisitorAccessible}
                    onCheckedChange={(checked) => setEditData({ ...editData, isVisitorAccessible: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-isCovered">Habitat Cubierto</Label>
                    <p className="text-sm text-muted-foreground">¿Tiene techo o cobertura?</p>
                  </div>
                  <Switch
                    id="edit-isCovered"
                    checked={editData.isCovered}
                    onCheckedChange={(checked) => setEditData({ ...editData, isCovered: checked })}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Actualizar Habitat
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {!habitat && !loading && searchId && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <TreePine className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontró ningún habitat con ese ID</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
