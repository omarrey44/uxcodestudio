"use client"

import * as React from "react"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion"
import { cn } from "@/lib/utils"

interface CardStickyProps extends HTMLMotionProps<"div"> {
  arrayLength: number
  index: number
  incrementY?: number
  incrementZ?: number
  incrementRotation?: number
}

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) throw new Error("useContainerScrollContext must be used within ContainerScroll")
  return context
}

export const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  className,
  ...props
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-svh w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn("relative", className)}
    style={{ perspective: "1000px", ...props.style }}
    {...props}
  >
    {children}
  </div>
)

export const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation = -index + 90,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext()

    const start = index / (arrayLength + 1)
    const end = (index + 1) / (arrayLength + 1)
    const range = React.useMemo(() => [start, end], [start, end])
    const rotateRange = [range[0] - 1.5, range[1] / 1.5]

    const y = useTransform(scrollYProgress, range, ["0%", "-180%"])
    const rotate = useTransform(scrollYProgress, rotateRange, [incrementRotation, 0])
    const transform = useMotionTemplate`translateZ(${index * incrementZ}px) translateY(${y}) rotate(${rotate}deg)`

    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: "hidden" as const,
      zIndex: (arrayLength - index) * incrementZ,
      ...style,
    }

    return (
      <motion.div
        layout="position"
        ref={ref}
        style={cardStyle}
        className={cn(
          "absolute will-change-transform",
          "flex size-full flex-col items-center justify-center gap-6 rounded-2xl",
          "border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md",
          className
        )}
        {...props}
      />
    )
  }
)
CardTransformed.displayName = "CardTransformed"

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  maxRating?: number
}

export const ReviewStars = React.forwardRef<HTMLDivElement, ReviewProps>(
  ({ rating, maxRating = 5, className, ...props }, ref) => {
    const filled = Math.floor(rating)
    const frac = rating - filled
    const empty = maxRating - filled - (frac > 0 ? 1 : 0)

    return (
      <div className={cn("flex items-center gap-1", className)} ref={ref} {...props}>
        {[...Array(filled)].map((_, i) => (
          <StarIcon key={`f-${i}`} filled />
        ))}
        {frac > 0 && <StarIcon frac={frac} />}
        {[...Array(empty)].map((_, i) => (
          <StarIcon key={`e-${i}`} />
        ))}
      </div>
    )
  }
)
ReviewStars.displayName = "ReviewStars"

function StarIcon({ filled, frac }: { filled?: boolean; frac?: number }) {
  const id = React.useId()
  return (
    <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
      {frac != null && (
        <defs>
          <linearGradient id={id}>
            <stop offset={`${frac * 100}%`} stopColor="currentColor" />
            <stop offset={`${frac * 100}%`} stopColor="rgb(55 65 81)" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={frac != null ? `url(#${id})` : filled ? "currentColor" : "rgb(55 65 81)"}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
      />
    </svg>
  )
}
