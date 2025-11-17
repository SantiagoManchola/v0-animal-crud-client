"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Keeper } from "@/types/keeper";
import { RefreshCw, Users, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = "http://localhost:8080";

export default function ListAllKeepersView() {
  const [keepers, setKeepers] = useState<Keeper[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const fetchKeepers = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/keepers`;
      if (filter === "active") {
        url += "?is_active=true";
      } else if (filter === "inactive") {
        url += "?is_active=false";
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setKeepers(data);
      }
    } catch (error) {
      console.error("Error fetching keepers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeepers();
  }, [filter]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Lista de Cuidadores
        </h1>
        <p className="text-muted-foreground">
          Visualiza todos los cuidadores registrados en el sistema
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>Filtra los cuidadores por estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los cuidadores</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cuidadores Registrados
              <Badge variant="secondary" className="ml-2">
                {keepers.length} resultados
              </Badge>
            </div>
            <Button onClick={fetchKeepers} size="sm" variant="outline">
              <RefreshCw
                className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </CardTitle>
          <CardDescription>
            {filter === "all" && "Mostrando todos los cuidadores"}
            {filter === "active" && "Mostrando solo cuidadores activos"}
            {filter === "inactive" && "Mostrando solo cuidadores inactivos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Cargando cuidadores...</p>
          </div>
        ) : keepers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No se encontraron cuidadores con el filtro seleccionado
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Especialización</TableHead>
                <TableHead>Experiencia</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {keepers.map((keeper) => (
                  <TableRow key={keeper.id}>
                    <TableCell className="font-mono text-sm">
                      {keeper.id}
                    </TableCell>
                  <TableCell className="font-medium">{`${keeper.firstName} ${keeper.lastName}`}</TableCell>
                  <TableCell>{keeper.email}</TableCell>
                  <TableCell>{keeper.specialization}</TableCell>
                  <TableCell>{keeper.yearsOfExperience} años</TableCell>
                  <TableCell>
                    <Badge variant={keeper.isActive ? "default" : "secondary"}>
                      {keeper.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
