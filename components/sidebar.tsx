"use client"

import type { ViewType } from "./animal-manager"
import { Button } from "@/components/ui/button"
import { Info, Plus, List, Edit, Trash2, Play as Paw, TreePine } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const animalMenuItems = [
  { id: "create" as ViewType, label: "Crear Animal", icon: Plus },
  { id: "list" as ViewType, label: "Listar Todos", icon: List },
  { id: "search-edit" as ViewType, label: "Buscar para Editar", icon: Edit },
  { id: "search-delete" as ViewType, label: "Buscar para Eliminar", icon: Trash2 },
]

const habitatMenuItems = [
  { id: "create-habitat" as ViewType, label: "Crear Habitat", icon: Plus },
  { id: "list-habitats" as ViewType, label: "Listar Todos", icon: List },
  { id: "search-edit-habitat" as ViewType, label: "Buscar para Editar", icon: Edit },
  { id: "search-delete-habitat" as ViewType, label: "Buscar para Eliminar", icon: Trash2 },
]

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Paw className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-lg font-semibold text-sidebar-foreground">Animal Manager</h1>
        </div>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Sistema CRUD para gestión</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          {/* About Section */}
          <div>
            <Button
              variant={currentView === "about" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-10 ${
                currentView === "about"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => onViewChange("about")}
            >
              <Info className="h-4 w-4" />
              Acerca de...
            </Button>
          </div>

          <Separator className="bg-sidebar-border" />

          <div>
            <div className="flex items-center gap-2 px-2 mb-2">
              <Paw className="h-4 w-4 text-sidebar-foreground/60" />
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">Animales</h2>
            </div>
            <div className="space-y-1">
              {animalMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-10 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator className="bg-sidebar-border" />

          <div>
            <div className="flex items-center gap-2 px-2 mb-2">
              <TreePine className="h-4 w-4 text-sidebar-foreground/60" />
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">Habitats</h2>
            </div>
            <div className="space-y-1">
              {habitatMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-10 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">v1.0.0 - Animal CRUD Client</p>
      </div>
    </div>
  )
}
