"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Keeper } from "@/types/keeper";
import { Animal } from "@/types/animal";
import { Search, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

export default function AssignKeeperView({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [animalId, setAnimalId] = useState("");
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [keepers, setKeepers] = useState<Keeper[]>([]);
  const [selectedKeeperId, setSelectedKeeperId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchActiveKeepers();
  }, []);

  const fetchActiveKeepers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/keepers?is_active=true`);
      if (response.ok) {
        const data = await response.json();
        setKeepers(data);
      }
    } catch (error) {
      console.error("Error fetching keepers:", error);
    }
  };

  const handleSearchAnimal = async () => {
    if (!animalId) {
      setMessage({ type: "error", text: "Por favor ingrese un ID de animal" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/animals/${animalId}`);
      if (response.ok) {
        const data = await response.json();
        setAnimal(data);
      } else {
        setMessage({ type: "error", text: "Animal no encontrado" });
        setAnimal(null);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" });
      console.error("Error fetching animal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignKeeper = async () => {
    if (!animal || !selectedKeeperId) {
      setMessage({ type: "error", text: "Por favor seleccione un cuidador" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/animals/${animal.id}/assign-keeper`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keeperId: parseInt(selectedKeeperId) }),
        }
      );

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Cuidador asignado exitosamente",
        });
        setAnimal(null);
        setAnimalId("");
        setSelectedKeeperId("");
        setTimeout(() => onSuccess(), 1500);
      } else {
        setMessage({ type: "error", text: "Error al asignar cuidador" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" });
      console.error("Error assigning keeper:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Asignar Cuidador
        </h1>
        <p className="text-muted-foreground">
          Asigna un cuidador activo a un animal del zoológico
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Animal
          </CardTitle>
          <CardDescription>
            Ingresa el ID del animal para asignarle un cuidador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="animalId">ID del Animal</Label>
              <Input
                id="animalId"
                type="number"
                placeholder="Ingrese ID del animal"
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchAnimal()}
              />
            </div>
            <Button
              onClick={handleSearchAnimal}
              disabled={loading}
              className="mt-auto"
            >
              <Search className="w-4 h-4 mr-1" />
              Buscar
            </Button>
          </div>

          {message && (
            <Alert
              className={
                message.type === "success"
                  ? "border-green-500"
                  : "border-destructive"
              }
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {animal && (
            <div className="space-y-4 pt-4 border-t">
              <div className="border rounded-lg p-4 bg-muted/30">
                <h3 className="text-lg font-semibold mb-3">{animal.name}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">
                      ID:
                    </span>
                    <p className="font-mono">{animal.id}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">
                      Peso:
                    </span>
                    <p>{animal.weight} kg</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">
                      Estado:
                    </span>
                    <div>
                      <Badge variant={animal.isWild ? "default" : "secondary"}>
                        {animal.isWild ? "Salvaje" : "Doméstico"}
                      </Badge>
                    </div>
                  </div>
                  {animal.keeperId && (
                    <div className="space-y-1">
                      <span className="font-medium text-muted-foreground">
                        Cuidador Actual:
                      </span>
                      <p className="font-mono">ID: {animal.keeperId}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keeper">Seleccionar Cuidador *</Label>
                <Select
                  value={selectedKeeperId}
                  onValueChange={setSelectedKeeperId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cuidador activo" />
                  </SelectTrigger>
                  <SelectContent>
                    {keepers.map((keeper) => (
                      <SelectItem key={keeper.id} value={keeper.id.toString()}>
                        {keeper.firstName} {keeper.lastName} -{" "}
                        {keeper.specialization} ({keeper.yearsOfExperience} años
                        exp.)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAssignKeeper}
                disabled={loading || !selectedKeeperId}
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? "Asignando..." : "Asignar Cuidador"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
