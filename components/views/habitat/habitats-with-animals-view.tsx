"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TreePine,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Habitat } from "@/types/habitat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function HabitatsWithAnimalsView() {
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [expandedHabitats, setExpandedHabitats] = useState<Set<number>>(
    new Set()
  );

  const fetchHabitats = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/habitats/with-animals`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setHabitats(data);
      // Auto-expand all habitats on load
      setExpandedHabitats(new Set(data.map((h: Habitat) => h.id)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los habitats"
      );
      setHabitats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitats();
  }, []);

  const toggleHabitat = (id: number) => {
    setExpandedHabitats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateTimeString;
    }
  };

  const totalAnimals = habitats.reduce(
    (sum, habitat) => sum + (habitat.animals?.length || 0),
    0
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            🌍 Todos los Habitats con sus Animales
          </h1>
          <p className="text-muted-foreground">
            Vista completa de todos los habitats y sus animales asociados
          </p>
        </div>
        <Button onClick={fetchHabitats} disabled={loading} variant="outline">
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Habitats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habitats.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Animales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnimals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Promedio por Habitat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {habitats.length > 0
                ? (totalAnimals / habitats.length).toFixed(1)
                : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && habitats.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Cargando habitats...</p>
          </CardContent>
        </Card>
      )}

      {/* Habitats List */}
      {!loading && habitats.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <TreePine className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground">No hay habitats registrados</p>
            <p className="text-sm text-muted-foreground mt-2">
              Crea un habitat para comenzar
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && habitats.length > 0 && (
        <div className="space-y-4">
          {habitats.map((habitat) => {
            const isExpanded = expandedHabitats.has(habitat.id);
            const animalCount = habitat.animals?.length || 0;

            return (
              <Card key={habitat.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => toggleHabitat(habitat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <TreePine className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-xl">
                          {habitat.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          ID: {habitat.id} • Área:{" "}
                          {habitat.area.toLocaleString("es-ES")} m² •
                          Establecido: {formatDateTime(habitat.establishedDate)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={habitat.isCovered ? "default" : "secondary"}
                      >
                        {habitat.isCovered ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Cubierto
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Descubierto
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        <Users className="h-3 w-3 mr-1" />
                        {animalCount}{" "}
                        {animalCount === 1 ? "animal" : "animales"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    {animalCount > 0 ? (
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Peso (kg)</TableHead>
                              <TableHead>Fecha de Nacimiento</TableHead>
                              <TableHead>Salvaje</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {habitat.animals!.map((animal) => (
                              <TableRow key={animal.id}>
                                <TableCell className="font-mono">
                                  {animal.id}
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {animal.name}
                                </TableCell>
                                <TableCell>
                                  {animal.weight.toFixed(1)} kg
                                </TableCell>
                                <TableCell>
                                  {formatDateTime(animal.birthDateTime)}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      animal.isWild
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {animal.isWild ? "Salvaje" : "Doméstico"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Este habitat no tiene animales registrados
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
