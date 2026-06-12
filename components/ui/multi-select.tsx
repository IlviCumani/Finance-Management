"use client"

import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import { useComposedRefs } from "@radix-ui/react-compose-refs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"
import React, {
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

type MultiSelectOption = {
  label: string
  value: string
}

interface MultiSelectorProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive
> {
  values: Array<string>
  onValuesChange: (value: Array<string>) => void
  options?: Array<MultiSelectOption>
  loop?: boolean
}

interface MultiSelectContextProps {
  value: Array<string>
  onValueChange: (value: string) => void
  options: Array<MultiSelectOption>
  open: boolean
  setOpen: (value: boolean) => void
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  inputRef: React.RefObject<HTMLInputElement | null>
  handleSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null)

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext)
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider")
  }
  return context
}

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  options = [],
  loop = false,
  className,
  children,
  dir,
  ...props
}: MultiSelectorProps) => {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [isValueSelected, setIsValueSelected] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState("")

  const onValueChangeHandler = useCallback(
    (val: string) => {
      if (value.includes(val)) {
        onValueChange(value.filter((item) => item !== val))
      } else {
        onValueChange([...value, val])
      }
    },
    [onValueChange, value]
  )

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      e.preventDefault()
      const target = e.currentTarget
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0
      )

      setSelectedValue(selection)
      setIsValueSelected(selection === inputValue)
    },
    [inputValue]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const target = inputRef.current

      if (!target) return

      const moveNext = () => {
        const nextIndex = activeIndex + 1
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex
        )
      }

      const movePrev = () => {
        const prevIndex = activeIndex - 1
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex)
      }

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1
        setActiveIndex(newIndex)
      }

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext()
            }
          } else if (value.length > 0 && target.selectionStart === 0) {
            movePrev()
          }
          break

        case "ArrowRight":
          if (dir === "rtl") {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev()
            }
          } else if (value.length > 0 && (activeIndex !== -1 || loop)) {
            moveNext()
          }
          break

        case "Backspace":
        case "Delete":
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              onValueChangeHandler(value[activeIndex])
              moveCurrent()
            } else if (
              target.selectionStart === 0 &&
              (selectedValue === inputValue || isValueSelected)
            ) {
              onValueChangeHandler(value[value.length - 1])
            }
          }
          break

        case "Enter":
          setOpen(true)
          break

        case "Escape":
          if (activeIndex !== -1) {
            setActiveIndex(-1)
          } else if (open) {
            setOpen(false)
          }
          break
      }
    },
    [
      activeIndex,
      dir,
      inputValue,
      isValueSelected,
      loop,
      onValueChangeHandler,
      open,
      selectedValue,
      value,
    ]
  )

  const contextValue = useMemo(
    () => ({
      value,
      onValueChange: onValueChangeHandler,
      options,
      open,
      setOpen,
      inputValue,
      setInputValue,
      activeIndex,
      setActiveIndex,
      inputRef,
      handleSelect,
    }),
    [
      value,
      onValueChangeHandler,
      options,
      open,
      inputValue,
      activeIndex,
      handleSelect,
    ]
  )

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <Command
        data-slot="multi-select"
        onKeyDown={handleKeyDown}
        className={cn("overflow-visible bg-transparent", className)}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  )
}

const MultiSelectorTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "default"
  }
>(({ className, children, size = "default", ...props }, ref) => {
  const { value, onValueChange, activeIndex, options } = useMultiSelect()

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const getLabel = useCallback(
    (item: string) =>
      options.find((option) => option.value === item)?.label ?? item,
    [options]
  )

  return (
    <div
      ref={ref}
      data-slot="multi-select-trigger"
      data-size={size}
      className={cn(
        "flex min-h-9 w-full items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm transition-[color,box-shadow,background-color] outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:min-h-9 data-[size=sm]:min-h-8 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {value.map((item, index) => (
          <Badge
            key={item}
            variant="secondary"
            className={cn(
              "h-6 gap-1 rounded-2xl px-2 text-xs font-medium",
              activeIndex === index && "ring-2 ring-ring/30"
            )}
          >
            <span className="max-w-32 truncate">{getLabel(item)}</span>
            <button
              aria-label={`Remove ${getLabel(item)} option`}
              aria-roledescription="button to remove option"
              type="button"
              onMouseDown={mousePreventDefault}
              onClick={() => onValueChange(item)}
            >
              <span className="sr-only">Remove {getLabel(item)} option</span>
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="size-3.5 hover:text-destructive"
              />
            </button>
          </Badge>
        ))}
        {children}
      </div>
      <HugeiconsIcon
        icon={UnfoldMoreIcon}
        strokeWidth={2}
        className="pointer-events-none size-4 shrink-0 text-muted-foreground"
      />
    </div>
  )
})

MultiSelectorTrigger.displayName = "MultiSelectorTrigger"

const MultiSelectorInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const {
    setOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    handleSelect,
    inputRef,
  } = useMultiSelect()

  const composedRefs = useComposedRefs(ref, inputRef)

  return (
    <CommandPrimitive.Input
      data-slot="multi-select-input"
      {...props}
      tabIndex={0}
      ref={composedRefs}
      value={inputValue}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      onSelect={handleSelect}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      className={cn(
        "min-w-16 flex-1 bg-transparent text-sm outline-none placeholder:text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
        activeIndex !== -1 && "caret-transparent"
      )}
    />
  )
})

MultiSelectorInput.displayName = "MultiSelectorInput"

const MultiSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open } = useMultiSelect()
  return (
    <div ref={ref} data-slot="multi-select-content" className="relative">
      {open && children}
    </div>
  )
})

MultiSelectorContent.displayName = "MultiSelectorContent"

const MultiSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList
      ref={ref}
      data-slot="multi-select-list"
      className={cn(
        "dark absolute top-1 z-50 mt-1 max-h-60 min-w-full origin-top animate-in overflow-x-hidden overflow-y-auto rounded-3xl bg-popover/70 p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 fade-in-0 zoom-in-95 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 dark:ring-foreground/10",
        className
      )}
    >
      {children}
      <CommandEmpty>
        <span className="px-3 py-2.5 text-sm text-muted-foreground">
          No results found
        </span>
      </CommandEmpty>
    </CommandList>
  )
})

MultiSelectorList.displayName = "MultiSelectorList"

const MultiSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: string } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ className, value, children, ...props }, ref) => {
  const {
    value: selectedValues,
    onValueChange,
    setInputValue,
  } = useMultiSelect()

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const isIncluded = selectedValues.includes(value)

  return (
    <CommandPrimitive.Item
      ref={ref}
      data-slot="multi-select-item"
      {...props}
      onSelect={() => {
        onValueChange(value)
        setInputValue("")
      }}
      className={cn(
        "relative flex w-full cursor-default items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
        isIncluded && "cursor-default opacity-50",
        props.disabled && "cursor-not-allowed opacity-50"
      )}
      onMouseDown={mousePreventDefault}
    >
      <span>{children}</span>
      {isIncluded && (
        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
          <HugeiconsIcon
            icon={Tick02Icon}
            strokeWidth={2}
            className="pointer-events-none"
          />
        </span>
      )}
    </CommandPrimitive.Item>
  )
})

MultiSelectorItem.displayName = "MultiSelectorItem"

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
}

export type { MultiSelectOption }
