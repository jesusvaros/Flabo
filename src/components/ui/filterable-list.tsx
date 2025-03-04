"use client"

import * as React from "react"
import { Input } from "./input"
import { Button } from "./button"
import { ScrollArea } from "./scroll-area"
import { Checkbox } from "./checkbox"
import { cn } from "@/lib/utils"
import { ArrowDownAZ, ArrowDownZA, CalendarDays } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Item {
  id: string
  content: string
  created_at?: string
}

interface FilterableListProps<T extends Item> {
  items: T[]
  selectedItems: string[]
  onItemToggle: (id: string) => void
  className?: string
  maxHeight?: string
}

export function FilterableList<T extends Item>({
  items: initialItems,
  selectedItems,
  onItemToggle,
  className,
  maxHeight = "300px"
}: FilterableListProps<T>) {
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
    e.preventDefault() // Prevent form submission
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
            <TooltipContent >
              <p>{getSortTooltip()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative" style={{ height: maxHeight }}>
        <ScrollArea className="h-full w-full rounded-md border">
          <div className="grid gap-2 p-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={item.id}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => onItemToggle(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.content}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
