"use client";

import React, { useState } from "react";
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
import { Keeper } from "@/types/keeper";
import { Search, Trash2, AlertCircle, CheckCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

export default function DeleteKeeperView({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [keeperId, setKeeperId] = useState("");
  const [keeper, setKeeper] = useState<Keeper | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!keeperId) {
      setMessage({ type: "error", text: "Por favor ingrese un ID" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/keepers/${keeperId}`);
      if (response.ok) {
        const data = await response.json();
        setKeeper(data);
        setMessage(null);
      } else {
        setMessage({ type: "error", text: "Cuidador no encontrado" });
        setKeeper(null);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error de conexión. Verifica que el servidor esté disponible.",
      });
      console.error("Error fetching keeper:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!keeper) return;

    if (
      !confirm(
        `¿Está seguro de eliminar al cuidador ${keeper.firstName} ${keeper.lastName}?`
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/keepers/${keeper.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Cuidador "${keeper.firstName} ${keeper.lastName}" eliminado exitosamente`,
        });
        setKeeper(null);
        setKeeperId("");
        setTimeout(() => onSuccess(), 1500);
      } else {
        setMessage({
          type: "error",
          text: "Error al eliminar cuidador. Intenta nuevamente.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error de conexión. Verifica que el servidor esté disponible.",
      });
      console.error("Error deleting keeper:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Eliminar Cuidador
        </h1>
        <p className="text-muted-foreground">
          Busca un cuidador por su ID para eliminarlo del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Cuidador
          </CardTitle>
          <CardDescription>
            Ingresa el ID del cuidador que deseas eliminar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="keeperId">ID del Cuidador</Label>
              <Input
                id="keeperId"
                type="number"
                placeholder="Ingrese ID del cuidador"
                value={keeperId}
                onChange={(e) => setKeeperId(e.target.value)}
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

          {message && !keeper && (
            <Alert
              className={
                message.type === "error"
                  ? "border-destructive"
                  : "border-green-500"
              }
            >
              {message.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {keeper && (
            <div className="space-y-4 pt-4 border-t">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {keeper.firstName} {keeper.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      ID: {keeper.id}
                    </p>
                  </div>
                  <Badge variant={keeper.isActive ? "default" : "secondary"}>
                    {keeper.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-muted-foreground">{keeper.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Especialización:</span>
                    <p className="text-muted-foreground">
                      {keeper.specialization}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Fecha de Contratación:</span>
                    <p className="text-muted-foreground">{keeper.hireDate}</p>
                  </div>
                  <div>
                    <span className="font-medium">Experiencia:</span>
                    <p className="text-muted-foreground">
                      {keeper.yearsOfExperience} años
                    </p>
                  </div>
                </div>
              </div>

              {message && (
                <Alert
                  className={
                    message.type === "error"
                      ? "border-destructive"
                      : "border-green-500"
                  }
                >
                  {message.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleDelete}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {loading ? "Eliminando..." : "Eliminar Cuidador"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
