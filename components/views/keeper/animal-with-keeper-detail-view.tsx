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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimalWithKeeper } from "@/types/keeper";
import { Search, AlertCircle, User, Users } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

export default function AnimalWithKeeperDetailView() {
  const [animalId, setAnimalId] = useState("");
  const [animalWithKeeper, setAnimalWithKeeper] =
    useState<AnimalWithKeeper | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!animalId) {
      setMessage({ type: "error", text: "Por favor ingrese un ID" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/animals/${animalId}/with-keeper`
      );
      if (response.ok) {
        const data = await response.json();
        setAnimalWithKeeper(data);
      } else {
        setMessage({ type: "error", text: "Animal no encontrado" });
        setAnimalWithKeeper(null);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" });
      console.error("Error fetching animal with keeper:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Detalle Animal-Cuidador
        </h1>
        <p className="text-muted-foreground">
          Consulta la información completa de un animal y su cuidador asignado
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Animal
          </CardTitle>
          <CardDescription>
            Ingresa el ID del animal para ver su información detallada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="animalId">ID del Animal</Label>
              <Input
                id="animalId"
                type="number"
                placeholder="Ingrese ID del animal"
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="mt-auto"
            >
              <Search className="w-4 h-4 mr-1" />
              Buscar
            </Button>
          </div>

          {message && (
            <Alert className="mt-4 border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {animalWithKeeper && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Animal Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Animal
              </CardTitle>
              <CardDescription>Detalles del animal seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">
                    {animalWithKeeper.animal.name}
                  </h3>
                  <Badge
                    variant={
                      animalWithKeeper.animal.isWild ? "default" : "secondary"
                    }
                  >
                    {animalWithKeeper.animal.isWild ? "Salvaje" : "Doméstico"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">
                      ID:
                    </span>
                    <p className="font-mono">{animalWithKeeper.animal.id}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">
                      Peso:
                    </span>
                    <p>{animalWithKeeper.animal.weight} kg</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <span className="font-medium text-muted-foreground">
                      Fecha de Nacimiento:
                    </span>
                    <p>
                      {new Date(
                        animalWithKeeper.animal.birthDateTime
                      ).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keeper Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cuidador Asignado
              </CardTitle>
              <CardDescription>
                {animalWithKeeper.keeper
                  ? "Información del cuidador responsable"
                  : "Sin cuidador asignado"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {animalWithKeeper.keeper ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">
                      {animalWithKeeper.keeper.firstName}{" "}
                      {animalWithKeeper.keeper.lastName}
                    </h3>
                    <Badge
                      variant={
                        animalWithKeeper.keeper.isActive
                          ? "default"
                          : "secondary"
                      }
                    >
                      {animalWithKeeper.keeper.isActive
                        ? "Activo"
                        : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="font-medium text-muted-foreground">
                        ID:
                      </span>
                      <p className="font-mono">{animalWithKeeper.keeper.id}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-medium text-muted-foreground">
                        Experiencia:
                      </span>
                      <p>{animalWithKeeper.keeper.yearsOfExperience} años</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <span className="font-medium text-muted-foreground">
                        Email:
                      </span>
                      <p className="text-blue-600">
                        {animalWithKeeper.keeper.email}
                      </p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <span className="font-medium text-muted-foreground">
                        Especialización:
                      </span>
                      <p>{animalWithKeeper.keeper.specialization}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <span className="font-medium text-muted-foreground">
                        Fecha de Contratación:
                      </span>
                      <p>{animalWithKeeper.keeper.hireDate}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">
                    Este animal no tiene un cuidador asignado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
