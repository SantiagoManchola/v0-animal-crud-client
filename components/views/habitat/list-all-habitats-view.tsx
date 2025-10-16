"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TreePine, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Habitat } from "@/types/habitat";

export function ListAllHabitatsView() {
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [filter, setFilter] = useState<"all" | "covered" | "not-covered">(
    "all"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHabitats();
  }, [filter]);

  const fetchHabitats = async () => {
    setLoading(true);

    // TODO: Uncomment when API is ready
    /*
    try {
      const filterParam = filter === "all" ? "" : `?isVisitorAccessible=${filter === "accessible"}`
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habitats${filterParam}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch habitats')
      }
      
      const data = await response.json()
      setHabitats(data)
    } catch (error) {
      console.error('Error fetching habitats:', error)
    } finally {
      setLoading(false)
    }
    */

    // Temporary: Mock data
    const mockHabitats: Habitat[] = [
      {
        id: 1001,
        name: "Sabana Africana",
        area: 2500.5,
        establishedDate: "2020-03-15T10:00:00",
        isCovered: false,
      },
      {
        id: 1002,
        name: "Bosque Tropical",
        area: 1800.75,
        establishedDate: "2019-07-22T14:30:00",
        isCovered: true,
      },
      {
        id: 1003,
        name: "Área de Cuarentena",
        area: 500.0,
        establishedDate: "2021-01-10T09:00:00",
        isCovered: true,
      },
      {
        id: 1004,
        name: "Acuario Principal",
        area: 3200.0,
        establishedDate: "2018-11-05T11:00:00",
        isCovered: true,
      },
    ];

    const filteredHabitats =
      filter === "all"
        ? mockHabitats
        : mockHabitats.filter((h) => h.isCovered === (filter === "covered"));

    setHabitats(filteredHabitats);
    setLoading(false);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <TreePine className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Listar Habitats
            </h1>
            <p className="text-muted-foreground">
              Visualiza todos los habitats registrados
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <CardDescription>Filtra los habitats por cobertura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="filter">Cobertura</Label>
              <Select
                value={filter}
                onValueChange={(value: any) => setFilter(value)}
              >
                <SelectTrigger id="filter">
                  <SelectValue placeholder="Selecciona un filtro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los habitats</SelectItem>
                  <SelectItem value="covered">Solo cubiertos</SelectItem>
                  <SelectItem value="not-covered">Solo no cubiertos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Habitats Registrados</CardTitle>
            <CardDescription>
              {loading
                ? "Cargando..."
                : `${habitats.length} habitat(s) encontrado(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {habitats.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <TreePine className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron habitats</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Área (m²)</TableHead>
                      <TableHead>Fecha Establecimiento</TableHead>
                      <TableHead>Cubierto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {habitats.map((habitat) => (
                      <TableRow key={habitat.id}>
                        <TableCell className="font-mono">
                          {habitat.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {habitat.name}
                        </TableCell>
                        <TableCell>{habitat.area.toFixed(2)}</TableCell>
                        <TableCell className="text-sm">
                          {formatDateTime(habitat.establishedDate)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={habitat.isCovered ? "default" : "outline"}
                          >
                            {habitat.isCovered ? "Sí" : "No"}
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
    </div>
  );
}
