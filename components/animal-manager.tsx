"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { AboutView } from "./views/about-view"
import { CreateView } from "./views/create-view"
import { ListAllView } from "./views/list-all-view"
import { SearchEditView } from "./views/search-edit-view"
import { SearchDeleteView } from "./views/search-delete-view"

export type ViewType = "about" | "create" | "list" | "edit" | "delete"

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
