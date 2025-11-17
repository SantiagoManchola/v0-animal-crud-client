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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Keeper } from "@/types/keeper";
import { Search, AlertCircle, Users, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = "http://localhost:8080";

type SearchType = "name" | "specialization" | "experience";

export default function SearchKeeperView() {
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [searchValue, setSearchValue] = useState("");
  const [keepers, setKeepers] = useState<Keeper[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!searchValue) {
      setMessage({ type: "error", text: "Por favor ingrese un valor de búsqueda" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      let url = "";
      switch (searchType) {
        case "name":
          url = `${API_BASE_URL}/keepers/search/by-name?name=${encodeURIComponent(
            searchValue
          )}`;
          break;
        case "specialization":
          url = `${API_BASE_URL}/keepers/search/by-specialization?specialization=${encodeURIComponent(
            searchValue
          )}`;
          break;
        case "experience":
          url = `${API_BASE_URL}/keepers/search/by-experience?min_years=${searchValue}`;
          break;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setKeepers(data);
        if (data.length === 0) {
          setMessage({ type: "error", text: "No se encontraron cuidadores con los criterios especificados" });
        }
      } else {
        setMessage({ type: "error", text: "Error en la búsqueda. Intenta nuevamente." });
        setKeepers([]);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión. Verifica que el servidor esté disponible." });
      console.error("Error searching keepers:", error);
      setKeepers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Buscar Cuidadores
        </h1>
        <p className="text-muted-foreground">
          Realiza búsquedas avanzadas de cuidadores por diferentes criterios
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Criterios de Búsqueda
          </CardTitle>
          <CardDescription>Selecciona el tipo de búsqueda e ingresa el valor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="searchType">Buscar por</Label>
              <Select
                value={searchType}
                onValueChange={(value) => setSearchType(value as SearchType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="specialization">Especialización</SelectItem>
                  <SelectItem value="experience">Experiencia Mínima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="searchValue">
                {searchType === "name" && "Nombre o Apellido"}
                {searchType === "specialization" && "Especialización"}
                {searchType === "experience" && "Años de Experiencia"}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="searchValue"
                  type={searchType === "experience" ? "number" : "text"}
                  placeholder={
                    searchType === "name"
                      ? "Ej: Carlos"
                      : searchType === "specialization"
                      ? "Ej: Mamíferos"
                      : "Ej: 5"
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="w-4 h-4 mr-1" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          {message && (
            <Alert className="mt-4 border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {keepers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resultados
              <Badge variant="secondary" className="ml-2">
                {keepers.length} encontrados
              </Badge>
            </CardTitle>
            <CardDescription>
              Cuidadores que coinciden con los criterios de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                        <Badge
                          variant={keeper.isActive ? "default" : "secondary"}
                        >
                          {keeper.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
