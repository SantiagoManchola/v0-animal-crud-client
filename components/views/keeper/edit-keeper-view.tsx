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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Keeper, KeeperFormData } from "@/types/keeper";
import { Edit, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

export default function EditKeeperView({
  keeper,
  onSuccess,
  onCancel,
}: {
  keeper: Keeper;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<KeeperFormData>(keeper);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setFormData(keeper);
  }, [keeper]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/keepers/${keeper.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: `Cuidador "${result.firstName} ${result.lastName}" actualizado exitosamente`,
        });
        setTimeout(() => onSuccess(), 1500);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Error al actualizar cuidador. Intenta nuevamente.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error de conexión. Verifica que el servidor esté disponible.",
      });
      console.error("Error updating keeper:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button onClick={onCancel} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a lista
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Editar Cuidador
        </h1>
        <p className="text-muted-foreground">
          Modifica la información del cuidador seleccionado
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Formulario de Edición
          </CardTitle>
          <CardDescription>
            El ID no se puede editar. Modifica los demás campos según sea necesario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">ID (Solo lectura)</Label>
                <Input
                  id="id"
                  type="number"
                  value={formData.id}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hireDate">Fecha de Contratación</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Años de Experiencia</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsOfExperience: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Especialización</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                placeholder="ej: Mamíferos, Aves, Reptiles, Acuáticos"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">¿Está activo?</Label>
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

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Actualizando..." : "Actualizar Cuidador"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
