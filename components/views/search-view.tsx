"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Animal } from "@/types/animal"
import { fetchAnimals } from "@/lib/utils"
import { Search, AlertCircle, CheckCircle, TreePine, Home } from "lucide-react"

interface SearchViewProps {
  onAnimalFound: (animal: Animal) => void
  title: string
  description: string
  actionLabel: string
}

export function SearchView({ onAnimalFound, title, description, actionLabel }: SearchViewProps) {
  const [searchId, setSearchId] = useState("")
  const [foundAnimal, setFoundAnimal] = useState<Animal | null>(null)
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
    setFoundAnimal(null)

    try {
      const animals = await fetchAnimals()
      if (!animals) {
        setMessage({
          type: "error",
          text: "No se pudo obtener la lista de animales del servidor.",
        })
        return
      }
      const animal = animals.find((a) => a.id === Number(searchId))
      if (animal) {
        setFoundAnimal(animal)
        setMessage({
          type: "success",
          text: "Animal encontrado exitosamente",
        })
      } else {
        setMessage({
          type: "error",
          text: "No se encontró ningún animal con ese ID",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al buscar el animal. Intenta nuevamente.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleAction = () => {
    if (foundAnimal) {
      onAnimalFound(foundAnimal)
    }
  }

  const resetSearch = () => {
    setSearchId("")
    setFoundAnimal(null)
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
              Buscar Animal
            </CardTitle>
            <CardDescription>Ingresa el ID numérico del animal que deseas buscar</CardDescription>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
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
          </CardContent>
        </Card>

        {/* Información del Animal Encontrado */}
        {foundAnimal && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Animal Encontrado
              </CardTitle>
              <CardDescription>Información completa del animal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">ID</span>
                  <p className="font-mono text-lg">{foundAnimal.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nombre</span>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    {foundAnimal.isWild ? (
                      <TreePine className="h-5 w-5 text-green-600" />
                    ) : (
                      <Home className="h-5 w-5 text-blue-600" />
                    )}
                    {foundAnimal.name}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Peso</span>
                  <p className="text-lg">{foundAnimal.weight} kg</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</span>
                  <p className="text-lg">{new Date(foundAnimal.birthDateTime).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Tipo</span>
                  <div className="mt-1">
                    <Badge variant={foundAnimal.isWild ? "default" : "secondary"}>
                      {foundAnimal.isWild ? "Salvaje" : "No salvaje"}
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
