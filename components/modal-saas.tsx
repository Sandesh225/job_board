'use client'

import React from "react"

import { forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/button-saas'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeButton?: boolean
  className?: string
  contentClassName?: string
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = 'md',
      closeButton = true,
      className,
      contentClassName,
    },
    ref
  ) => {
    if (!isOpen) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
          role="presentation"
        />
        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-border bg-card shadow-lg transition-all',
              sizeClasses[size],
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || closeButton) && (
              <div className="flex items-start justify-between border-b border-border px-6 py-4">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-lg font-bold text-card-foreground">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                {closeButton && (
                  <button
                    onClick={onClose}
                    className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            {/* Content */}
            <div className={cn('px-6 py-4', contentClassName)}>
              {children}
            </div>
          </div>
        </div>
      </>
    )
  }
)

Modal.displayName = 'Modal'

export interface ModalFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex gap-3 justify-end border-t border-border px-6 py-4',
        className
      )}
      {...props}
    />
  )
)

ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalFooter }
