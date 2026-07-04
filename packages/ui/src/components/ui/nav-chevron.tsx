import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NavChevronProps extends Omit<React.SVGProps<SVGSVGElement>, 'children' | 'ref'> {
  isHighlighted?: boolean
  ref?: React.Ref<SVGSVGElement>
}

export function NavChevron({ ref, isHighlighted, className, style, ...props }: NavChevronProps) {
  return (
    <svg
      ref={ref}
      data-nav-chevron="true"
      aria-hidden="true"
      viewBox="0 0 7 12"
      className={cn(
        'mt-[0.22em] h-[1.1rem] w-[0.65rem] shrink-0 text-current transition-transform duration-200 ease-out md:h-[1.35rem] md:w-[0.8rem]',
        className
      )}
      style={{
        transform: isHighlighted ? 'translateX(5px)' : 'translateX(0px)',
        ...style,
      }}
      {...props}
    >
      <path
        d="M0,11.23.12,11l.32-.47.3-.12-.16-.35.18-.49.4-.21L1.09,9l.23-.35.26-.21.32-.21L2,7.84l.2-.38v-.3l.47-.47-.05-.38L3,6.08l-.19-.77,0-.26-.26-.3-.1-.31-.42-.25,0-.38-.32-.23L1.5,3.25l0-.32-.05-.26L1,2.37.94,2,.66,1.76.51,1.41.23,1.08.3.66.14.41,0,.13l.7,0L1,.08l.14.14L1.68,0,2,.12,2.21,0l.66.21.26,0h.42l.33.14L4.3.69l0,.38.29.27.14.4L5,2l.07.37,0,.14L5.48,3l.07.09.42.3.1.33L6,4.07l.24.33.42.25,0,.35.1.4.16.47-.11.42-.21.33L6.41,7,6.2,7.2,6,7.6,6,7.93l-.28.31-.3.3,0,.19-.16.37L5,9.43l-.18.14-.23.33-.21.38.09.42-.3.33,0,.18-.66.24-.39.1-.52.09,0-.09-.5-.09-.46.07-.26.09-.4,0-.39-.07-.45.17L0,11.23Z"
        fill="currentColor"
      />
    </svg>
  )
}
