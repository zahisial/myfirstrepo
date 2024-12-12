"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "../lib/utils"

interface GenericSelectorProps {
  options: { value: string; label: string }[]
  placeholder: string
  onChange: (value: string) => void
  value: string
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  isRTL?: boolean // New prop for RTL languages like Arabic
}

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-full border border-input p-4 bg-indigo-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="w-4 h-4 opacity-50" />
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-indigo-800 text-popover-foreground shadow-md animate-in fade-in-80",
        position === "popper" && "translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="w-4 h-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export default function GenericSelector({
  options,
  placeholder = "Select an option...",
  emptyMessage = "No options found.",
  onChange,
  value,
  searchable = false,
  searchPlaceholder = "Search options...",
  isRTL = false, // New prop with default value
}: GenericSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchable) return options
    return options.filter((option) =>
      option.label?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [options, searchTerm, searchable])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[280px]", isRTL && "text-right flex flex-row-reverse")}>
        <SelectValue placeholder={placeholder} className={isRTL ? "text-right" : "text-left"} />
      </SelectTrigger>
      <SelectContent>
        {searchable && (
          <div className={cn("flex items-center px-3 pb-2 border-b", isRTL && "flex-row-reverse")}>
            <Search className={cn("w-4 h-4 opacity-50 shrink-0", isRTL ? "ml-2" : "mr-2")} />
            <input
              placeholder={searchPlaceholder}
              className={cn(
                "flex w-full h-10 py-3 text-sm bg-transparent rounded-md outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                isRTL ? "text-right" : "text-left"
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <SelectGroup>
          <div className={cn(
            "max-h-[200px] overflow-y-auto",
            isRTL ? "text-right" : "text-left",
            isRTL && "flex flex-col items-end" // Add this line
          )}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className={cn(isRTL && "w-full justify-end")}>
                  {option.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-results" disabled>
                {emptyMessage}
              </SelectItem>
            )}
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}