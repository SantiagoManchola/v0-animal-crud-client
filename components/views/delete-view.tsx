"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Animal } from "@/types/animal";
import { deleteAnimal } from "@/lib/utils";
import {
  Trash2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  TreePine,
  Home,
  MapPin,
} from "lucide-react";

interface DeleteViewProps {
  animal: Animal;
  onBack: () => void;
  onDeleted: () => void;
}

export function DeleteView({ animal, onBack, onDeleted }: DeleteViewProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage(null);

    try {
      const ok = await deleteAnimal(animal.id);
      if (ok) {
        setMessage({
          type: "success",
          text: `Animal "${animal.name}" (ID: ${animal.id}) eliminado exitosamente`,
        });
        setTimeout(() => {
          onDeleted();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: "Error al eliminar el animal. Intenta nuevamente.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al eliminar el animal. Intenta nuevamente.",
      });
    } finally {
      setIsDeleting(false);
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
          Eliminar Animal
        </h1>
        <p className="text-muted-foreground">
          Revisa la información antes de eliminar permanentemente
        </p>
      </div>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Información del Animal
          </CardTitle>
          <CardDescription>
            Esta acción no se puede deshacer. Revisa cuidadosamente antes de
            confirmar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                ID
              </span>
              <p className="font-mono text-lg">{animal.id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Nombre
              </span>
              <p className="text-lg font-semibold flex items-center gap-2">
                {animal.isWild ? (
                  <TreePine className="h-5 w-5 text-green-600" />
                ) : (
                  <Home className="h-5 w-5 text-blue-600" />
                )}
                {animal.name}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Peso
              </span>
              <p className="text-lg">{animal.weight} kg</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Fecha de Nacimiento
              </span>
              <p className="text-lg">
                {new Date(animal.birthDateTime).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Tipo
              </span>
              <div className="mt-1">
                <Badge variant={animal.isWild ? "default" : "secondary"}>
                  {animal.isWild ? "Salvaje" : "No salvaje"}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Hábitat
              </span>
              <p className="text-lg">
                {animal.habitat?.name ? (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {animal.habitat?.name}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="italic">Sin hábitat</span>
                  </div>
                )}
              </p>
            </div>
          </div>

          {!showConfirmation ? (
            <Button
              onClick={() => setShowConfirmation(true)}
              variant="destructive"
              className="w-full mt-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Animal
            </Button>
          ) : (
            <div className="space-y-4 mt-4">
              <Alert className="border-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>¿Estás seguro?</strong> Esta acción no se puede
                  deshacer. El animal "{animal.name}" será eliminado
                  permanentemente del sistema.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="destructive"
                  className="flex-1"
                >
                  {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                </Button>
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
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
