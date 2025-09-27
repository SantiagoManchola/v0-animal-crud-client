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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAnimals, deleteAnimal } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Animal } from "@/types/animal";
import {
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function SearchDeleteView() {
  const [searchId, setSearchId] = useState("");
  const [foundAnimal, setFoundAnimal] = useState<Animal | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!searchId.trim() || isNaN(Number(searchId))) {
      setMessage({
        type: "error",
        text: "Por favor ingresa un ID numérico válido",
      });
      return;
    }
    setIsSearching(true);
    setMessage(null);
    setFoundAnimal(null);
    setShowConfirmation(false);
    try {
      const animals = await fetchAnimals();
      if (!animals) {
        setMessage({
          type: "error",
          text: "No se pudo obtener la lista de animales del servidor.",
        });
        return;
      }
      const animal = animals.find((a) => a.id === Number(searchId));
      if (animal) {
        setFoundAnimal(animal);
        setMessage({
          type: "success",
          text: "Animal encontrado. Revisa la información antes de eliminar.",
        });
      } else {
        setMessage({
          type: "error",
          text: "No se encontró ningún animal con ese ID",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al buscar el animal. Intenta nuevamente.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!foundAnimal) return;
    setIsDeleting(true);
    setMessage(null);
    try {
      const ok = await deleteAnimal(foundAnimal.id);
      if (ok) {
        setMessage({
          type: "success",
          text: `Animal "${foundAnimal.name}" (ID: ${foundAnimal.id}) eliminado exitosamente`,
        });
        setFoundAnimal(null);
        setShowConfirmation(false);
        setSearchId("");
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

  const resetSearch = () => {
    setSearchId("");
    setFoundAnimal(null);
    setShowConfirmation(false);
    setMessage(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Buscar y Eliminar Animal
        </h1>
        <p className="text-muted-foreground">
          Busca un animal por ID y elimínalo del sistema
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Animal
            </CardTitle>
            <CardDescription>
              Ingresa el ID numérico del animal que deseas eliminar
            </CardDescription>
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
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex-1"
              >
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
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Animal a Eliminar
              </CardTitle>
              <CardDescription>
                Revisa cuidadosamente la información antes de eliminar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">ID:</span>
                  <span className="ml-2 font-mono text-sm">
                    {foundAnimal.id}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Nombre:</span>
                  <span className="ml-2 text-lg font-semibold">
                    {foundAnimal.name}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Peso:</span>
                  <span className="ml-2">{foundAnimal.weight} kg</span>
                </div>
                <div>
                  <span className="font-medium">Fecha de Nacimiento:</span>
                  <span className="ml-2">
                    {new Date(foundAnimal.birthDateTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tipo:</span>
                  <Badge variant={foundAnimal.isWild ? "default" : "secondary"}>
                    {foundAnimal.isWild ? "Salvaje" : "No salvaje"}
                  </Badge>
                </div>
              </div>

              {!showConfirmation ? (
                <Button
                  onClick={() => setShowConfirmation(true)}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Animal
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>¿Estás seguro?</strong> Esta acción no se puede
                      deshacer. El animal "{foundAnimal.name}" será eliminado
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
        )}
      </div>

      {/* Mensajes */}
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
