"use client"

import * as React from "react"
import { Input } from "./input"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { ArrowDownAZ, ArrowDownZA, CalendarDays } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "./badge"

interface Item {
  id: string
  content: string
  created_at?: string
}

interface FilterableTagListProps<T extends Item> {
  items: T[]
  selectedItems: string[]
  onItemToggle: (id: string) => void
  className?: string
}

export function FilterableTagList<T extends Item>({
  items: initialItems,
  selectedItems,
  onItemToggle,
  className,
}: FilterableTagListProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState<"alpha" | "date" | "alpha-desc">("alpha")
  const [items, setItems] = React.useState(initialItems)

  React.useEffect(() => {
    let filtered = [...initialItems]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "alpha":
          return a.content.localeCompare(b.content)
        case "alpha-desc":
          return b.content.localeCompare(a.content)
        case "date":
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          }
          return 0
        default:
          return 0
      }
    })

    setItems(filtered)
  }, [initialItems, searchTerm, sortOrder])

  const toggleSort = (e: React.MouseEvent) => {
    e.preventDefault()
    if (sortOrder === "alpha") {
      setSortOrder("alpha-desc")
    } else if (sortOrder === "alpha-desc") {
      setSortOrder("date")
    } else {
      setSortOrder("alpha")
    }
  }

  const getSortIcon = () => {
    switch (sortOrder) {
      case "alpha":
        return <ArrowDownAZ className="h-4 w-4 text-foreground" />
      case "alpha-desc":
        return <ArrowDownZA className="h-4 w-4 text-foreground" />
      case "date":
        return <CalendarDays className="h-4 w-4 text-foreground" />
    }
  }

  const getSortTooltip = () => {
    switch (sortOrder) {
      case "alpha":
        return "Sort A to Z"
      case "alpha-desc":
        return "Sort Z to A"
      case "date":
        return "Sort by Date"
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSort}
                className="shrink-0 bg-background hover:bg-muted"
                type="button"
              >
                {getSortIcon()}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getSortTooltip()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge
            key={item.id}
            variant={selectedItems.includes(item.id) ? "default" : "outline"}
            className={cn(
              "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors",
              selectedItems.includes(item.id) && "bg-primary text-primary-foreground"
            )}
            onClick={() => onItemToggle(item.id)}
          >
            {item.content}
          </Badge>
        ))}
      </div>
    </div>
  )
}
