import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Code, Database, Globe } from "lucide-react";

export function AboutView() {
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">(
    "checking"
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const checkHealth = async () => {
      try {
        const res = await fetch("http://localhost:8080/health");
        if (res.ok) {
          setApiStatus("online");
        } else {
          setApiStatus("offline");
        }
      } catch {
        setApiStatus("offline");
      }
    };
    checkHealth();
    interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Acerca del Proyecto
        </h1>
        <p className="text-muted-foreground text-lg">
          Sistema de gestión CRUD para animales desarrollado con Next.js y
          SpringBoot
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del Equipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipo de Desarrollo
            </CardTitle>
            <CardDescription>
              Información sobre los desarrolladores del proyecto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Santiago Manchola</p>
              <p className="text-sm text-muted-foreground">Oscar Casallas</p>
              <p className="text-sm text-muted-foreground">Andres Nieto</p>
              <p className="text-sm text-muted-foreground">Jose Hidalgo</p>
            </div>
            <div>
              <h4 className="font-semibold">Tecnologías Utilizadas</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">Next.js 15</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">SpringBoot</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Técnica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Información Técnica
            </CardTitle>
            <CardDescription>
              Detalles sobre la arquitectura y funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Versión</h4>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div>
              <h4 className="font-semibold">Funcionalidades</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Crear animales (POST)</li>
                <li>• Listar todos con filtros (GET)</li>
                <li>• Buscar y editar (PUT)</li>
                <li>• Buscar y eliminar (DELETE)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Modelo de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Modelo de Datos
            </CardTitle>
            <CardDescription>Estructura del objeto Animal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-blue-600">id:</span> int
                </div>
                <div>
                  <span className="text-blue-600">name:</span> string
                </div>
                <div>
                  <span className="text-blue-600">weight:</span> double
                </div>
                <div>
                  <span className="text-blue-600">birthDateTime:</span>{" "}
                  LocalDateTime
                </div>
                <div>
                  <span className="text-blue-600">isWild:</span> boolean
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Backend
            </CardTitle>
            <CardDescription>
              Información sobre la API de SpringBoot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Estado</h4>
              {apiStatus === "checking" && (
                <Badge
                  variant="outline"
                  className="text-gray-600 border-gray-600"
                >
                  Verificando...
                </Badge>
              )}
              {apiStatus === "online" && (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  API Activa
                </Badge>
              )}
              {apiStatus === "offline" && (
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-600"
                >
                  API Inactiva
                </Badge>
              )}
            </div>
            <div>
              <h4 className="font-semibold">Endpoints Planeados</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• GET /api/animals</li>
                <li>• GET /api/animals/:id</li>
                <li>• POST /api/animals</li>
                <li>• PUT /api/animals/:id</li>
                <li>• DELETE /api/animals/:id</li>
                <li>
                  • GET /health{" "}
                  <span className="text-xs text-gray-500">
                    (Estado del servidor)
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
