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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeeperFormData } from "@/types/keeper";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

export default function CreateKeeperView({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<KeeperFormData>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    hireDate: "",
    specialization: "",
    isActive: true,
    yearsOfExperience: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/keepers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: `Cuidador "${result.firstName} ${result.lastName}" creado exitosamente con ID: ${result.id}`,
        });
        setFormData({
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
          hireDate: "",
          specialization: "",
          isActive: true,
          yearsOfExperience: 0,
        });
        setTimeout(() => onSuccess(), 1500);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text:
            errorData.message || "Error al crear cuidador. Intenta nuevamente.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error de conexión. Verifica que el servidor esté disponible.",
      });
      console.error("Error creating keeper:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Crear Nuevo Cuidador
        </h1>
        <p className="text-muted-foreground">
          Completa el formulario para agregar un nuevo cuidador al sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Información del Cuidador
          </CardTitle>
          <CardDescription>Todos los campos son obligatorios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">ID (Identificador)</Label>
                <Input
                  id="id"
                  type="number"
                  value={formData.id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id: parseInt(e.target.value) || 0,
                    })
                  }
                  required
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando..." : "Crear Cuidador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
