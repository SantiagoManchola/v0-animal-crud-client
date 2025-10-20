"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Habitat } from "@/types/habitat"
import { Trash2, AlertTriangle, CheckCircle, AlertCircle, ArrowLeft, TreePine, Shield } from "lucide-react"
import { deleteHabitat } from "@/lib/utils"

interface DeleteHabitatViewProps {
  habitat: Habitat
  onBack: () => void
  onDeleted: () => void
}

export function DeleteHabitatView({ habitat, onBack, onDeleted }: DeleteHabitatViewProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setMessage(null)

    const result = await deleteHabitat(habitat.id)

    if (result === true) {
      setMessage({
        type: "success",
        text: `Habitat "${habitat.name}" (ID: ${habitat.id}) eliminado exitosamente`,
      })
      setTimeout(() => {
        onDeleted()
      }, 2000)
    } else if (typeof result === "object" && result.error409) {
      setMessage({
        type: "error",
        text: result.message,
      })
      setShowConfirmation(false)
    } else {
      setMessage({
        type: "error",
        text: "Error al eliminar el habitat. Intenta nuevamente.",
      })
      setShowConfirmation(false)
    }

    setIsDeleting(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a búsqueda
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Eliminar Habitat</h1>
        <p className="text-muted-foreground">Revisa la información antes de eliminar permanentemente</p>
      </div>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Información del Habitat
          </CardTitle>
          <CardDescription>Esta acción no se puede deshacer. Revisa cuidadosamente antes de confirmar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">ID</span>
              <p className="font-mono text-lg">{habitat.id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Nombre</span>
              <p className="text-lg font-semibold flex items-center gap-2">
                <TreePine className="h-5 w-5 text-green-600" />
                {habitat.name}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Área</span>
              <p className="text-lg">{habitat.area.toFixed(2)} m²</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Fecha de Establecimiento</span>
              <p className="text-lg">{new Date(habitat.establishedDate).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Estado</span>
              <div className="mt-1">
                <Badge variant={habitat.isCovered ? "default" : "secondary"}>
                  {habitat.isCovered ? (
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

          {!showConfirmation ? (
            <Button onClick={() => setShowConfirmation(true)} variant="destructive" className="w-full mt-4">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Habitat
            </Button>
          ) : (
            <div className="space-y-4 mt-4">
              <Alert className="border-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>¿Estás seguro?</strong> Esta acción no se puede deshacer. El habitat "{habitat.name}" será
                  eliminado permanentemente del sistema.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button onClick={handleDelete} disabled={isDeleting} variant="destructive" className="flex-1">
                  {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                </Button>
                <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {message && (
        <Alert className={`mt-6 ${message.type === "error" ? "border-destructive" : "border-green-500"}`}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
