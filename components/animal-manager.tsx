"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { AboutView } from "./views/about-view";
import { CreateView } from "./views/create-view";
import { ListAllView } from "./views/list-all-view";
import { CreateHabitatView } from "./views/habitat/create-habitat-view";
import { ListAllHabitatsView } from "./views/habitat/list-all-habitats-view";
import { SearchView } from "./views/search-view";
import { EditView } from "./views/edit-view";
import { DeleteView } from "./views/delete-view";
import { SearchHabitatView } from "./views/habitat/search-habitat-view";
import { EditHabitatView } from "./views/habitat/edit-habitat-view";
import { DeleteHabitatView } from "./views/habitat/delete-habitat-view";
import { SearchAnimalsView } from "./views/search-animals-view";
import { HabitatDetailView } from "./views/habitat/habitat-detail-view";
import { HabitatsWithAnimalsView } from "./views/habitat/habitats-with-animals-view";
import type { Animal } from "@/types/animal";
import type { Habitat } from "@/types/habitat";

export type ViewType =
  | "about"
  | "create"
  | "list"
  | "search-animals"
  | "search-edit"
  | "edit"
  | "search-delete"
  | "delete"
  | "create-habitat"
  | "list-habitats"
  | "habitat-detail"
  | "habitats-with-animals"
  | "search-edit-habitat"
  | "edit-habitat"
  | "search-delete-habitat"
  | "delete-habitat";

export function AnimalManager() {
  const [currentView, setCurrentView] = useState<ViewType>("about");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null);

  const renderView = () => {
    switch (currentView) {
      case "about":
        return <AboutView />;
      case "create":
        return <CreateView />;
      case "list":
        return <ListAllView />;
      case "search-animals":
        return <SearchAnimalsView />;
      case "search-edit":
        return (
          <SearchView
            onAnimalFound={(animal) => {
              setSelectedAnimal(animal);
              setCurrentView("edit");
            }}
            title="Buscar Animal para Editar"
            description="Busca un animal por su ID para editarlo"
            actionLabel="Continuar a Edición"
          />
        );
      case "edit":
        return selectedAnimal ? (
          <EditView
            animal={selectedAnimal}
            onBack={() => {
              setSelectedAnimal(null);
              setCurrentView("search-edit");
            }}
          />
        ) : (
          <AboutView />
        );
      case "search-delete":
        return (
          <SearchView
            onAnimalFound={(animal) => {
              setSelectedAnimal(animal);
              setCurrentView("delete");
            }}
            title="Buscar Animal para Eliminar"
            description="Busca un animal por su ID para eliminarlo"
            actionLabel="Continuar a Eliminación"
          />
        );
      case "delete":
        return selectedAnimal ? (
          <DeleteView
            animal={selectedAnimal}
            onBack={() => {
              setSelectedAnimal(null);
              setCurrentView("search-delete");
            }}
            onDeleted={() => {
              setSelectedAnimal(null);
              setCurrentView("list");
            }}
          />
        ) : (
          <AboutView />
        );
      case "create-habitat":
        return <CreateHabitatView />;
      case "list-habitats":
        return <ListAllHabitatsView />;
      case "habitat-detail":
        return <HabitatDetailView />;
      case "habitats-with-animals":
        return <HabitatsWithAnimalsView />;
      case "search-edit-habitat":
        return (
          <SearchHabitatView
            onHabitatFound={(habitat) => {
              setSelectedHabitat(habitat);
              setCurrentView("edit-habitat");
            }}
            title="Buscar Habitat para Editar"
            description="Busca un habitat por su ID para editarlo"
            actionLabel="Continuar a Edición"
          />
        );
      case "edit-habitat":
        return selectedHabitat ? (
          <EditHabitatView
            habitat={selectedHabitat}
            onBack={() => {
              setSelectedHabitat(null);
              setCurrentView("search-edit-habitat");
            }}
          />
        ) : (
          <AboutView />
        );
      case "search-delete-habitat":
        return (
          <SearchHabitatView
            onHabitatFound={(habitat) => {
              setSelectedHabitat(habitat);
              setCurrentView("delete-habitat");
            }}
            title="Buscar Habitat para Eliminar"
            description="Busca un habitat por su ID para eliminarlo"
            actionLabel="Continuar a Eliminación"
          />
        );
      case "delete-habitat":
        return selectedHabitat ? (
          <DeleteHabitatView
            habitat={selectedHabitat}
            onBack={() => {
              setSelectedHabitat(null);
              setCurrentView("search-delete-habitat");
            }}
            onDeleted={() => {
              setSelectedHabitat(null);
              setCurrentView("list-habitats");
            }}
          />
        ) : (
          <AboutView />
        );
      default:
        return <AboutView />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">{renderView()}</main>
    </div>
  );
}
