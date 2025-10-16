"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Trash2, AlertTriangle, CheckCircle2, TreePine } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Habitat } from "@/types/habitat"

export function SearchDeleteHabitatView() {
  const [searchId, setSearchId] = useState("")
  const [habitat, setHabitat] = useState<Habitat | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSearch = async () => {
    if (!searchId) return

    setLoading(true)
    setHabitat(null)
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
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!habitat) return

    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habitats/${habitat.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete habitat')
      }
      
      console.log('Habitat deleted:', habitat.id)
      setSuccess(true)
      setHabitat(null)
      setSearchId("")
    } catch (error) {
      console.error('Error deleting habitat:', error)
    }
    */

    // Temporary: Simulate success
    console.log("Habitat deleted (simulated):", habitat.id)
    setSuccess(true)
    setHabitat(null)
    setSearchId("")

    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="h-8 w-8 text-destructive" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Buscar y Eliminar Habitat</h1>
            <p className="text-muted-foreground">Busca un habitat por ID para eliminarlo</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Habitat
            </CardTitle>
            <CardDescription>Ingresa el ID del habitat que deseas eliminar</CardDescription>
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
            <AlertDescription className="text-green-600">Habitat eliminado exitosamente!</AlertDescription>
          </Alert>
        )}

        {habitat && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información del Habitat</CardTitle>
              <CardDescription>Revisa la información antes de eliminar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-mono font-semibold">{habitat.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nombre</Label>
                  <p className="font-semibold">{habitat.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Área (m²)</Label>
                  <p className="font-semibold">{habitat.area.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fecha Establecimiento</Label>
                  <p className="font-semibold text-sm">{formatDateTime(habitat.establishedDate)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Accesible para Visitantes</Label>
                  <div className="mt-1">
                    <Badge variant={habitat.isVisitorAccessible ? "default" : "secondary"}>
                      {habitat.isVisitorAccessible ? "Sí" : "No"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Habitat Cubierto</Label>
                  <div className="mt-1">
                    <Badge variant={habitat.isCovered ? "default" : "outline"}>{habitat.isCovered ? "Sí" : "No"}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {habitat && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta acción no se puede deshacer. El habitat será eliminado permanentemente del sistema.
            </AlertDescription>
          </Alert>
        )}

        {habitat && (
          <Button variant="destructive" size="lg" className="w-full" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Confirmar Eliminación
          </Button>
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
