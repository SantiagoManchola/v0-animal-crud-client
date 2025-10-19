"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Habitat } from "@/types/habitat"
import { Search, AlertCircle, CheckCircle, TreePine, Shield } from "lucide-react"
import { fetchHabitatById } from "@/lib/utils"

interface SearchHabitatViewProps {
  onHabitatFound: (habitat: Habitat) => void
  title: string
  description: string
  actionLabel: string
}

export function SearchHabitatView({ onHabitatFound, title, description, actionLabel }: SearchHabitatViewProps) {
  const [searchId, setSearchId] = useState("")
  const [foundHabitat, setFoundHabitat] = useState<Habitat | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleSearch = async () => {
    if (!searchId.trim() || isNaN(Number(searchId))) {
      setMessage({
        type: "error",
        text: "Por favor ingresa un ID numérico válido",
      })
      return
    }

    setIsSearching(true)
    setMessage(null)
    setFoundHabitat(null)

    const habitat = await fetchHabitatById(Number(searchId))

    if (habitat) {
      setFoundHabitat(habitat)
      setMessage({
        type: "success",
        text: "Habitat encontrado exitosamente",
      })
    } else {
      setMessage({
        type: "error",
        text: "No se encontró ningún habitat con ese ID",
      })
    }

    setIsSearching(false)
  }

  const handleAction = () => {
    if (foundHabitat) {
      onHabitatFound(foundHabitat)
    }
  }

  const resetSearch = () => {
    setSearchId("")
    setFoundHabitat(null)
    setMessage(null)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6">
        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Habitat
            </CardTitle>
            <CardDescription>Ingresa el ID numérico del habitat que deseas buscar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchId">ID del Habitat</Label>
              <Input
                id="searchId"
                type="number"
                placeholder="Ej: 1001, 1002..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isSearching} className="flex-1">
                {isSearching ? "Buscando..." : "Buscar Habitat"}
              </Button>
              <Button onClick={resetSearch} variant="outline">
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información del Habitat Encontrado */}
        {foundHabitat && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Habitat Encontrado
              </CardTitle>
              <CardDescription>Información completa del habitat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">ID</span>
                  <p className="font-mono text-lg">{foundHabitat.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nombre</span>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-green-600" />
                    {foundHabitat.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Área</span>
                  <p className="text-lg">{foundHabitat.area.toFixed(2)} m²</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Fecha de Establecimiento</span>
                  <p className="text-lg">{new Date(foundHabitat.establishedDate).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Estado</span>
                  <div className="mt-1 flex gap-2">
                    <Badge variant={foundHabitat.isCovered ? "default" : "secondary"}>
                      {foundHabitat.isCovered ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Cubierto
                        </>
                      ) : (
                        "Descubierto"
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button onClick={handleAction} className="w-full mt-4">
                {actionLabel}
              </Button>
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
