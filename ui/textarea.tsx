'use client'

import React from "react"
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helper?: string
  showCount?: boolean
  maxCount?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      icon,
      helper,
      showCount = false,
      maxCount,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = error && error.length > 0
    const currentLength = (props.value as string)?.length || 0
    const isValid = maxCount ? currentLength >= maxCount : true

    return (
      <div className="w-full space-y-2">
        {/* Label with optional counter */}
        {label && (
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-foreground">
              {label}
              {props.required && <span className="ml-1 text-destructive">*</span>}
            </label>
            {showCount && maxCount && (
              <div className="flex items-center gap-2">
                {isValid ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-full border",
                  isValid 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                )}>
                  {currentLength} / {maxCount}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Progress bar for character count */}
        {showCount && maxCount && (
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                isValid 
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-amber-500 to-amber-600"
              )}
              style={{ width: `${Math.min((currentLength / maxCount) * 100, 100)}%` }}
            />
          </div>
        )}

        {/* Textarea wrapper */}
        <div
          className={cn(
            "flex items-start gap-2 rounded-lg border bg-input px-3 py-3 text-base outline-none transition-all duration-200",
            "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            hasError &&
              "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {icon && (
            <div className="text-muted-foreground pointer-events-none flex-shrink-0 pt-0.5">
              {icon}
            </div>
          )}
          <textarea
            disabled={disabled}
            ref={ref}
            className={cn(
              "w-full bg-transparent outline-none border-none focus:ring-0 text-foreground placeholder:text-muted-foreground resize-none",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            {...props}
          />
        </div>

        {/* Helper text or error */}
        {helper && !hasError && (
          <p className="text-xs text-muted-foreground mt-1">{helper}</p>
        )}
        {hasError && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }