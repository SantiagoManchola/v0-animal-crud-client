"use client"

import type { ViewType } from "./animal-manager"
import { Button } from "@/components/ui/button"
import { Info, Plus, List, Edit, Trash2, Play as Paw } from "lucide-react"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const menuItems = [
  { id: "about" as ViewType, label: "Acerca de...", icon: Info },
  { id: "create" as ViewType, label: "Crear Animal", icon: Plus },
  { id: "list" as ViewType, label: "Listar Todos", icon: List },
  { id: "edit" as ViewType, label: "Buscar para Editar", icon: Edit },
  { id: "delete" as ViewType, label: "Buscar para Eliminar", icon: Trash2 },
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
        <p className="text-sm text-sidebar-foreground/60 mt-1">Sistema CRUD para gestión de animales</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
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
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">v1.0.0 - Animal CRUD Client</p>
      </div>
    </div>
  )
}
