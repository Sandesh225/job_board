"use client";

import React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      icon,
      helper,
      type = "text",
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasError = error && error.length > 0;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-foreground">
            {label}
            {props.required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-input px-3 py-3 text-base outline-none transition-all duration-200",
            "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            hasError &&
              "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          {icon && (
            <div className="text-muted-foreground pointer-events-none flex-shrink-0">
              {icon}
            </div>
          )}
          <input
            type={type}
            disabled={disabled}
            ref={ref}
            className={cn(
              "w-full bg-transparent outline-none border-none focus:ring-0 text-foreground placeholder:text-muted-foreground",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            {...props}
          />
        </div>
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
    );
  },
);

Input.displayName = "Input";

export { Input };
