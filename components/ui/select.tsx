"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
}>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  selectedLabel: "",
  setSelectedLabel: () => {},
});

export function Select({
  value = "",
  onValueChange = () => {},
  children,
  placeholder = "选择...",
  disabled,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState(placeholder);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, open, setOpen, selectedLabel, setSelectedLabel }}
    >
      <div ref={ref} className="relative">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectTrigger) {
            return React.cloneElement(child as React.ReactElement<SelectTriggerProps>, {
              ...child.props,
              className: cn(child.props.className, disabled && "opacity-50 cursor-not-allowed"),
            });
          }
          return child;
        })}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const { open, setOpen, selectedLabel } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "dark:border-gray-700 dark:bg-gray-900",
        className
      )}
    >
      <span className="truncate">{children || selectedLabel}</span>
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { selectedLabel } = React.useContext(SelectContext);
  return <span>{selectedLabel || placeholder}</span>;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { open } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg",
        "animate-in fade-in-0 zoom-in-95 dark:border-gray-700 dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen, setSelectedLabel } =
    React.useContext(SelectContext);
  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(value);
        setSelectedLabel(typeof children === "string" ? children : value);
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
        isSelected
          ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
    >
      {children}
      {isSelected && <Check className="h-4 w-4" />}
    </button>
  );
}
