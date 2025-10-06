"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Animal, AnimalEditData } from "@/types/animal"
import { updateAnimal } from "@/lib/utils"
import { Edit, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"

interface EditViewProps {
  animal: Animal
  onBack: () => void
}

export function EditView({ animal, onBack }: EditViewProps) {
  const [editData, setEditData] = useState<AnimalEditData>({
    id: animal.id,
    name: animal.name,
    weight: animal.weight,
    birthDateTime: animal.birthDateTime,
    isWild: animal.isWild,
  })
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
    if (editData.weight <= 0) {
      setMessage({ type: "error", text: "El peso debe ser mayor a 0 kg" })
      return
    }
    if (!editData.birthDateTime) {
      setMessage({
        type: "error",
        text: "La fecha y hora de nacimiento es requerida",
      })
      return
    }

    setIsEditing(true)
    setMessage(null)

    try {
      let birthDateTime = editData.birthDateTime
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(birthDateTime)) {
        birthDateTime += ":00"
      }
      const result = await updateAnimal({ ...editData, birthDateTime })
      if (result) {
        setMessage({
          type: "success",
          text: `Animal "${result.name}" actualizado exitosamente`,
        })
      } else {
        setMessage({
          type: "error",
          text: "Error al actualizar el animal. Intenta nuevamente.",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al actualizar el animal. Intenta nuevamente.",
      })
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a búsqueda
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Editar Animal</h1>
        <p className="text-muted-foreground">Modifica la información del animal seleccionado</p>
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
              <Label htmlFor="editNombre">Nombre</Label>
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
              <Label htmlFor="editPeso">Peso (kg)</Label>
              <Input
                id="editPeso"
                type="number"
                step="0.1"
                min="0"
                value={editData.weight || ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    weight: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editBirthDateTime">Fecha y Hora de Nacimiento</Label>
              <Input
                id="editBirthDateTime"
                type="datetime-local"
                value={editData.birthDateTime}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    birthDateTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="editIsWild"
              checked={editData.isWild}
              onCheckedChange={(checked) => setEditData((prev) => ({ ...prev, isWild: checked }))}
            />
            <Label htmlFor="editIsWild">¿Es un animal salvaje?</Label>
          </div>

          <Button onClick={handleEdit} disabled={isEditing} className="w-full mt-6">
            {isEditing ? "Actualizando..." : "Actualizar Animal"}
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
