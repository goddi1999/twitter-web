import { useState, type ChangeEvent } from 'react'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type ClearableInputProps = {
  value: string
  onValueChange?: (value: string) => void
  label: string
  labelVisibility?: 'visible' | 'sr-only'
  placeholder?: string
  id: string
  name?: string
  type?: React.HTMLInputTypeAttribute
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  hideSeparator?: boolean
  showClearButton?: boolean
  inputClassName?: string
  className?: string
}

export function ClearableInput({
  value,
  onValueChange,
  label,
  labelVisibility = 'visible',
  placeholder = label,
  id,
  name,
  type = 'text',
  inputMode,
  autoComplete,
  required = false,
  disabled = false,
  maxLength,
  hideSeparator = false,
  showClearButton = true,
  inputClassName,
  className,
}: ClearableInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const canClear = showClearButton && value.length > 0 && !disabled

  return (
    <div className={cn('w-full pb-2', className)}>
      <Label
        htmlFor={id}
        className={labelVisibility === 'sr-only' ? 'sr-only' : undefined}
      >
        {label}
      </Label>

      <div
        className="relative my-3 w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onValueChange?.(event.target.value)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'placeholder:text-muted-foreground w-full bg-transparent py-2 text-base outline-none disabled:opacity-50',
            '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
            canClear && 'pr-10',
            inputClassName,
          )}
        />
        {canClear ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="absolute top-1/2 right-0 -translate-y-1/2 text-muted-foreground"
            aria-label="Clear"
            onClick={() => onValueChange?.('')}
          >
            <XIcon className="size-4" />
          </Button>
        ) : null}
      </div>

      {!hideSeparator ? (
        <Separator
          orientation="horizontal"
          decorative
          className={cn(
            'transition-colors duration-200',
            isFocused
              ? 'bg-primary'
              : isHovered
                ? 'bg-muted-foreground/45'
                : undefined,
          )}
        />
      ) : null}
    </div>
  )
}
