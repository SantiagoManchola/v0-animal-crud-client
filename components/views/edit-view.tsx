"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Animal, AnimalEditData } from "@/types/animal";
import type { Habitat } from "@/types/habitat";
import { updateAnimal, fetchHabitats } from "@/lib/utils";
import {
  Edit,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  MapPin,
} from "lucide-react";

interface EditViewProps {
  animal: Animal;
  onBack: () => void;
}

export function EditView({ animal, onBack }: EditViewProps) {
  const [editData, setEditData] = useState<AnimalEditData>({
    id: animal.id,
    name: animal.name,
    weight: animal.weight,
    birthDateTime: animal.birthDateTime,
    isWild: animal.isWild,
    habitat: {
      id: animal.habitat?.id,
    },
  });
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadHabitats();
  }, []);

  const loadHabitats = async () => {
    try {
      const data = await fetchHabitats();
      if (data) {
        setHabitats(data);
      } else {
        console.error("Error al cargar hábitats");
      }
    } catch (error) {
      console.error("Error fetching habitats:", error);
    }
  };

  const handleEdit = async () => {
    if (!editData.name.trim()) {
      setMessage({ type: "error", text: "El nombre es requerido" });
      return;
    }
    if (editData.weight <= 0) {
      setMessage({ type: "error", text: "El peso debe ser mayor a 0 kg" });
      return;
    }
    if (!editData.birthDateTime) {
      setMessage({
        type: "error",
        text: "La fecha y hora de nacimiento es requerida",
      });
      return;
    }

    setIsEditing(true);
    setMessage(null);

    try {
      let birthDateTime = editData.birthDateTime;
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(birthDateTime)) {
        birthDateTime += ":00";
      }

      // Preparar datos para enviar, excluyendo habitat si no está seleccionado
      const dataToSend: any = { ...editData, birthDateTime };
      if (!editData.habitat?.id || editData.habitat.id === 0) {
        delete dataToSend.habitat;
      }

      const result = await updateAnimal(dataToSend);
      if (result) {
        setMessage({
          type: "success",
          text: `Animal "${result.name}" actualizado exitosamente`,
        });
      } else {
        setMessage({
          type: "error",
          text: "Error al actualizar el animal. Intenta nuevamente.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al actualizar el animal. Intenta nuevamente.",
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a búsqueda
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Editar Animal
        </h1>
        <p className="text-muted-foreground">
          Modifica la información del animal seleccionado
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Formulario de Edición
          </CardTitle>
          <CardDescription>
            El ID no se puede editar. Modifica los demás campos según sea
            necesario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="editId">ID (Solo lectura)</Label>
              <Input
                id="editId"
                type="number"
                value={editData.id}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editNombre">Nombre</Label>
              <Input
                id="editNombre"
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, name: e.target.value }))
                }
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
              <Label htmlFor="editBirthDateTime">
                Fecha y Hora de Nacimiento
              </Label>
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

          <div className="space-y-2 mt-4">
            <Label htmlFor="editHabitat" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Habitat (Opcional)
            </Label>
            <Select
              value={
                editData.habitat?.id && editData.habitat.id > 0
                  ? editData.habitat.id.toString()
                  : "0"
              }
              onValueChange={(value) =>
                setEditData((prev) => ({
                  ...prev,
                  habitat: {
                    id: Number.parseInt(value) || 0,
                  },
                }))
              }
            >
              <SelectTrigger id="editHabitat">
                <SelectValue placeholder="Selecciona un habitat (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin habitat asignado</SelectItem>
                {habitats.map((habitat) => (
                  <SelectItem key={habitat.id} value={habitat.id.toString()}>
                    {habitat.name} - {habitat.area.toFixed(2)} m²
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="editIsWild"
              checked={editData.isWild}
              onCheckedChange={(checked) =>
                setEditData((prev) => ({ ...prev, isWild: checked }))
              }
            />
            <Label htmlFor="editIsWild">¿Es un animal salvaje?</Label>
          </div>

          <Button
            onClick={handleEdit}
            disabled={isEditing}
            className="w-full mt-6"
          >
            {isEditing ? "Actualizando..." : "Actualizar Animal"}
          </Button>
        </CardContent>
      </Card>

      {message && (
        <Alert
          className={`mt-6 ${
            message.type === "error" ? "border-destructive" : "border-green-500"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
