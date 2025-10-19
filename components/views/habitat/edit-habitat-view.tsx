"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Habitat, HabitatEditData } from "@/types/habitat";
import { Edit, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { updateHabitat } from "@/lib/utils";

interface EditHabitatViewProps {
  habitat: Habitat
  onBack: () => void
}

export function EditHabitatView({ habitat, onBack }: EditHabitatViewProps) {
  const [editData, setEditData] = useState<HabitatEditData>({
    id: habitat.id,
    name: habitat.name,
    area: habitat.area,
    establishedDate: habitat.establishedDate.slice(0, 16), // Format for datetime-local input
    isCovered: habitat.isCovered,
  });
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleEdit = async () => {
    if (!editData.name.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" })
      return
    }
    if (editData.area <= 0) {
      setMessage({ type: "error", text: "El área debe ser mayor a 0 m²" })
      return
    }
    if (!editData.establishedDate) {
      setMessage({
        type: "error",
        text: "La fecha y hora de establecimiento es requerida",
      })
      return
    }

    setIsEditing(true)
    setMessage(null)

    // Format establishedDate to include seconds if not present
    let establishedDate = editData.establishedDate
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(establishedDate)) {
      establishedDate += ":00"
    }

    const dataToSend = {
      ...editData,
      establishedDate,
    }

    const result = await updateHabitat(dataToSend)

    if (result) {
      setMessage({
        type: "success",
        text: `Habitat "${result.name}" actualizado exitosamente`,
      })
    } else {
      setMessage({
        type: "error",
        text: "Error al actualizar el habitat. Intenta nuevamente.",
      })
    }

    setIsEditing(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a búsqueda
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Editar Habitat</h1>
        <p className="text-muted-foreground">Modifica la información del habitat seleccionado</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Formulario de Edición
          </CardTitle>
          <CardDescription>El ID no se puede editar. Modifica los demás campos según sea necesario.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="editId">ID (Solo lectura)</Label>
              <Input id="editId" type="number" value={editData.id} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editNombre">Nombre del Habitat</Label>
              <Input
                id="editNombre"
                type="text"
                value={editData.name}
                onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editArea">Área (m²)</Label>
              <Input
                id="editArea"
                type="number"
                step="0.01"
                min="0"
                value={editData.area || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    area: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEstablishedDate">Fecha y Hora de Establecimiento</Label>
              <Input
                id="editEstablishedDate"
                type="datetime-local"
                value={editData.establishedDate}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    establishedDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="editIsCovered"
              checked={editData.isCovered}
              onCheckedChange={(checked) => setEditData((prev) => ({ ...prev, isCovered: checked }))}
            />
            <Label htmlFor="editIsCovered">¿Está cubierto?</Label>
          </div>

          <Button onClick={handleEdit} disabled={isEditing} className="w-full mt-6">
            {isEditing ? "Actualizando..." : "Actualizar Habitat"}
          </Button>
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
