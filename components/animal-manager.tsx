"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { AboutView } from "./views/about-view"
import { CreateView } from "./views/create-view"
import { ListAllView } from "./views/list-all-view"
import { SearchEditView } from "./views/search-edit-view"
import { SearchDeleteView } from "./views/search-delete-view"
import { CreateHabitatView } from "./views/habitat/create-habitat-view"
import { ListAllHabitatsView } from "./views/habitat/list-all-habitats-view"
import { SearchEditHabitatView } from "./views/habitat/search-edit-habitat-view"
import { SearchDeleteHabitatView } from "./views/habitat/search-delete-habitat-view"

export type ViewType =
  | "about"
  | "create"
  | "list"
  | "edit"
  | "delete"
  | "create-habitat"
  | "list-habitats"
  | "edit-habitat"
  | "delete-habitat"

export function AnimalManager() {
  const [currentView, setCurrentView] = useState<ViewType>("about")

  const renderView = () => {
    switch (currentView) {
      case "about":
        return <AboutView />
      case "create":
        return <CreateView />
      case "list":
        return <ListAllView />
      case "edit":
        return <SearchEditView />
      case "delete":
        return <SearchDeleteView />
      case "create-habitat":
        return <CreateHabitatView />
      case "list-habitats":
        return <ListAllHabitatsView />
      case "edit-habitat":
        return <SearchEditHabitatView />
      case "delete-habitat":
        return <SearchDeleteHabitatView />
      default:
        return <AboutView />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">{renderView()}</main>
    </div>
  )
}
