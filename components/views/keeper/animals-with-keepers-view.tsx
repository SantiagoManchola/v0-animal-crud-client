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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimalWithKeeper } from "@/types/keeper";
import { RefreshCw, Users } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

export default function AnimalsWithKeepersView() {
  const [animalsWithKeepers, setAnimalsWithKeepers] = useState<
    AnimalWithKeeper[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchAnimalsWithKeepers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/animals/with-keepers`);
      if (response.ok) {
        const data = await response.json();
        setAnimalsWithKeepers(data);
      }
    } catch (error) {
      console.error("Error fetching animals with keepers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalsWithKeepers();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Animales con Cuidadores
        </h1>
        <p className="text-muted-foreground">
          Listado completo de animales y sus cuidadores asignados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Animales
              <Badge variant="secondary" className="ml-2">
                {animalsWithKeepers.length} animales
              </Badge>
            </div>
            <Button
              onClick={fetchAnimalsWithKeepers}
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </CardTitle>
          <CardDescription>
            Vista detallada de todos los animales con información de sus
            cuidadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Cargando animales...</p>
            </div>
          ) : animalsWithKeepers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground">
                No hay animales registrados
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre Animal</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Cuidador</TableHead>
                    <TableHead>Especialización</TableHead>
                    <TableHead>Experiencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {animalsWithKeepers.map(({ animal, keeper }) => (
                    <TableRow key={animal.id}>
                      <TableCell className="font-mono text-sm">
                        {animal.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {animal.name}
                      </TableCell>
                      <TableCell>{animal.weight} kg</TableCell>
                      <TableCell>
                        <Badge
                          variant={animal.isWild ? "default" : "secondary"}
                        >
                          {animal.isWild ? "Salvaje" : "Doméstico"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {keeper ? (
                          <div>
                            <p className="font-medium">
                              {keeper.firstName} {keeper.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {keeper.email}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline">Sin asignar</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {keeper ? keeper.specialization : "-"}
                      </TableCell>
                      <TableCell>
                        {keeper ? `${keeper.yearsOfExperience} años` : "-"}
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
