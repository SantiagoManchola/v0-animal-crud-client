"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Search, Weight, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Animal } from "@/types/animal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function SearchAnimalsView() {
  const [searchType, setSearchType] = useState<"weight" | "name">("weight");
  const [minWeight, setMinWeight] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchByWeight = async () => {
    const weight = parseFloat(minWeight);
    if (isNaN(weight) || weight <= 0) {
      setError("Por favor ingresa un peso válido mayor a 0");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await fetch(
        `${API_URL}/animals/search/by-weight?min_weight=${weight}`
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setAnimals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar animales");
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName.trim()) {
      setError("Por favor ingresa un nombre para buscar");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await fetch(
        `${API_URL}/animals/search/by-name?name=${encodeURIComponent(
          searchName
        )}`
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setAnimals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar animales");
      setAnimals([]);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          🔍 Búsqueda Avanzada de Animales
        </h1>
        <p className="text-muted-foreground">
          Busca animales por peso mínimo o por nombre
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Búsqueda por Peso */}
        <Card className={searchType === "weight" ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="h-5 w-5" />
              Buscar por Peso Mínimo
            </CardTitle>
            <CardDescription>
              Encuentra animales que pesen más de un valor específico (kg)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minWeight">Peso Mínimo (kg)</Label>
                <Input
                  id="minWeight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ej: 50"
                  value={minWeight}
                  onChange={(e) => {
                    setMinWeight(e.target.value);
                    setSearchType("weight");
                    setHasSearched(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchByWeight();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSearchByWeight}
                disabled={loading}
                className="w-full"
                variant={searchType === "weight" ? "default" : "outline"}
              >
                <Search className="h-4 w-4 mr-2" />
                {loading && searchType === "weight"
                  ? "Buscando..."
                  : "Buscar por Peso"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Búsqueda por Nombre */}
        <Card className={searchType === "name" ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Buscar por Nombre
            </CardTitle>
            <CardDescription>
              Encuentra animales que contengan un texto en su nombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchName">Nombre del Animal</Label>
                <Input
                  id="searchName"
                  type="text"
                  placeholder="Ej: león"
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setSearchType("name");
                    setHasSearched(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchByName();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSearchByName}
                disabled={loading}
                className="w-full"
                variant={searchType === "name" ? "default" : "outline"}
              >
                <Search className="h-4 w-4 mr-2" />
                {loading && searchType === "name"
                  ? "Buscando..."
                  : "Buscar por Nombre"}
              </Button>
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

      {/* Results */}
      {hasSearched && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Búsqueda</CardTitle>
            <CardDescription>
              {animals.length === 0
                ? "No se encontraron animales con los criterios especificados"
                : `Se encontraron ${animals.length} animal(es)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {animals.length > 0 ? (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>Fecha de Nacimiento</TableHead>
                      <TableHead>Salvaje</TableHead>
                      <TableHead>Habitat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-mono">{animal.id}</TableCell>
                        <TableCell className="font-semibold">
                          {animal.name}
                        </TableCell>
                        <TableCell>{animal.weight.toFixed(1)} kg</TableCell>
                        <TableCell>
                          {formatDateTime(animal.birthDateTime)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              animal.isWild ? "destructive" : "secondary"
                            }
                          >
                            {animal.isWild ? "Salvaje" : "Doméstico"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {animal.habitat?.name ||
                              `Habitat #${animal.habitat?.id}`}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay resultados para mostrar</p>
                <p className="text-sm mt-2">
                  Intenta con otros criterios de búsqueda
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
