"use client"

import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGsapModal } from '@/hooks/use-gsap-modal'
import { BlobPlayButton } from './blob-play-button'

// ─────────────────────────────────────────────────────────────
// TrailerVideo Context
// ─────────────────────────────────────────────────────────────

interface TrailerVideoContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const TrailerVideoContext = React.createContext<TrailerVideoContextValue | null>(null)

function useTrailerVideoContext() {
  const context = React.useContext(TrailerVideoContext)
  if (!context) {
    throw new Error('useTrailerVideoContext must be used within a TrailerVideo')
  }
  return context
}

// ─────────────────────────────────────────────────────────────
// TrailerVideo Root Component
// ─────────────────────────────────────────────────────────────

interface TrailerVideoProps extends Omit<DialogPrimitive.Root.Props, 'open' | 'onOpenChange'> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TrailerVideo({ children, open: controlledOpen, onOpenChange, ...props }: TrailerVideoProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  // Sync internal state with controlled props if necessary
  const handleOpenChange = React.useCallback(
    (newOpen: boolean, event?: any) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({
      open: isOpen,
      setOpen: (val: boolean) => handleOpenChange(val),
    }),
    [isOpen, handleOpenChange]
  )

  return (
    <TrailerVideoContext.Provider value={contextValue}>
      <DialogPrimitive.Root
        open={isOpen}
        onOpenChange={(newOpen, event) => handleOpenChange(newOpen, event)}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </TrailerVideoContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────
// Thumbnail Trigger
// ─────────────────────────────────────────────────────────────

interface TrailerVideoThumbnailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string
  alt?: string
  blobColor?: string
}

export const TrailerVideoThumbnail = React.forwardRef<HTMLButtonElement, TrailerVideoThumbnailProps>(
  ({ src, alt = "Video thumbnail", className, blobColor = "#eaff3d", ...props }, ref) => {
    return (
      <DialogPrimitive.Trigger
        render={(triggerProps) => {
          const { ref: triggerRef, ...rest } = triggerProps as { ref?: React.Ref<HTMLButtonElement>; [key: string]: unknown }
          return (
            <button
              ref={(node) => {
                if (typeof triggerRef === 'function') triggerRef(node)
                else if (triggerRef) triggerRef.current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
              }}
              className={cn(
                'group relative inline-flex items-center justify-center overflow-visible',
                className
              )}
              {...rest}
              {...props}
            >
              {/* Jagged / Skewed Image Container */}
              <div 
                className="relative overflow-hidden shadow-soft-splat-md border-4 border-white dark:border-[#1a1a1a]"
                style={{ 
                  transform: 'rotate(-2deg)', 
                  clipPath: 'polygon(2% 0%, 100% 2%, 98% 100%, 0% 98%)',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Tape Decoration 1 */}
                <div 
                  className="absolute -top-4 -left-4 w-24 h-10 bg-yellow-400 opacity-90 mix-blend-multiply dark:mix-blend-normal"
                  style={{ transform: 'rotate(-15deg)', clipPath: 'polygon(0% 10%, 100% 0%, 95% 100%, 5% 90%)' }}
                />
                
                {/* Tape Decoration 2 */}
                <div 
                  className="absolute -bottom-4 -right-4 w-32 h-12 bg-splat-blue opacity-90 mix-blend-multiply dark:mix-blend-normal"
                  style={{ transform: 'rotate(-5deg)', clipPath: 'polygon(5% 0%, 95% 10%, 100% 90%, 0% 100%)' }}
                />
              </div>

              {/* Centered WebGL Play Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* 
                  Pointer events are re-enabled here so the blob button can scale independently on hover,
                  but typically the whole thumbnail is clickable. 
                */}
                <BlobPlayButton 
                  hexColor={blobColor} 
                  blobSize={160} 
                  className="pointer-events-auto shadow-none" 
                  tabIndex={-1} // Prevent double tabbing since parent is trigger
                />
              </div>
            </button>
          )
        }}
      />
    )
  }
)
TrailerVideoThumbnail.displayName = 'TrailerVideoThumbnail'

// ─────────────────────────────────────────────────────────────
// Animated Content Modal
// ─────────────────────────────────────────────────────────────

interface TrailerVideoContentProps extends Omit<DialogPrimitive.Popup.Props, 'children'> {
  videoId: string
  title?: string
}

export const TrailerVideoContent = React.forwardRef<HTMLDivElement, TrailerVideoContentProps>(
  ({ className, videoId, title = "YouTube video player", ...props }, ref) => {
    const { open } = useTrailerVideoContext()
    
    // Manage internal mounting state to allow exit animations to finish
    const [isMounted, setIsMounted] = React.useState(open)

    // Synchronously mount when open becomes true so the GSAP hook gets the ref immediately
    if (open && !isMounted) {
      setIsMounted(true)
    }

    const handleCloseComplete = React.useCallback(() => {
      setIsMounted(false)
    }, [])

    const { contentRef } = useGsapModal({
      isOpen: open,
      durationIn: 600,
      durationOut: 600,
      onCloseComplete: handleCloseComplete,
    })

    if (!isMounted) return null

    return (
      <DialogPrimitive.Portal keepMounted>
        {/* Dark overlay backdrop */}
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-500",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        
        {/* Modal Positioner */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <DialogPrimitive.Popup
            ref={(node) => {
              if (typeof ref === 'function') ref(node)
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
              // Call the GSAP state setter to trigger animation on mount
              contentRef(node)
            }}
            className={cn(
              "relative w-full max-w-5xl mx-auto shadow-2xl outline-none",
              className
            )}
            style={{
              // Set initial styles for the GSAP-like entrance
              transform: "translateY(20%) scale(0.7) rotate(0deg)",
              opacity: 0,
            }}
            {...props}
          >
            {/* The 16:9 Video Container */}
            <div className="relative w-full overflow-hidden bg-black border-4 border-white dark:border-[#1a1a1a]" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Splatoon Styled Close Button */}
            <DialogPrimitive.Close
              className="absolute -top-12 right-0 md:-right-12 p-2 rounded-full bg-yellow-400 text-black border-2 border-black shadow-solid-sm hover:scale-110 hover:-rotate-12 transition-transform duration-200"
            >
              <XIcon className="w-6 h-6 stroke-[3]" />
              <span className="sr-only">Close video</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Popup>
        </div>
      </DialogPrimitive.Portal>
    )
  }
)
TrailerVideoContent.displayName = 'TrailerVideoContent'
