import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import {
  Children,
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import {
  ANIMATION_PRESETS,
  DEFAULT_COLLAPSED,
  DEFAULT_EXPANDED,
  REDUCED_PRESET,
  SPRING_VALUES,
} from './expandable.constants'
import type {
  ExpandableCardProps,
  ExpandableContentProps,
  ExpandableContextValue,
  ExpandableProps,
} from './expandable.types'
import { ExpandableContext, useExpandable } from './use-expandable'
import { useMeasure } from './use-measure'

/** Springs toward `target`; with reduced motion it jumps there. */
function useSpringTo(target: number, reduced: boolean) {
  const value = useMotionValue(target)
  const spring = useSpring(value, SPRING_VALUES)
  useEffect(() => {
    if (reduced) spring.jump(target)
    value.set(target)
  }, [target, reduced, value, spring])
  return spring
}

export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      children,
      expanded,
      onToggle,
      transitionDuration = 0.3,
      easeType = 'easeInOut',
      expandDirection = 'vertical',
      expandBehavior = 'replace',
      initialDelay = 0,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = useState(false)
    const isExpanded = expanded ?? internal
    const toggleExpand = onToggle ?? (() => setInternal((prev) => !prev))
    const reducedMotion = useReducedMotion() ?? false

    // fire start callbacks when the state changes, not on mount or re-render
    const previous = useRef(isExpanded)
    useEffect(() => {
      if (previous.current === isExpanded) return
      previous.current = isExpanded
      if (isExpanded) onExpandStart?.()
      else onCollapseStart?.()
    }, [isExpanded, onExpandStart, onCollapseStart])

    const value: ExpandableContextValue = {
      isExpanded,
      toggleExpand,
      expandDirection,
      expandBehavior,
      transitionDuration: reducedMotion ? 0 : transitionDuration,
      easeType,
      initialDelay,
      reducedMotion,
      onExpandEnd,
      onCollapseEnd,
    }

    return (
      <ExpandableContext.Provider value={value}>
        <motion.div
          ref={ref}
          initial={false}
          transition={{ duration: transitionDuration, ease: easeType, delay: initialDelay }}
          {...props}
        >
          {typeof children === 'function' ? children({ isExpanded }) : children}
        </motion.div>
      </ExpandableContext.Provider>
    )
  },
)
Expandable.displayName = 'Expandable'

/** Hidden while collapsed; grows to its measured height and plays a preset on expand. */
export const ExpandableContent = forwardRef<HTMLDivElement, ExpandableContentProps>(
  (
    {
      children,
      preset,
      animateIn,
      animateOut,
      stagger = false,
      staggerChildren = 0.1,
      keepMounted = false,
      style,
      ...props
    },
    ref,
  ) => {
    const { isExpanded, transitionDuration, easeType, reducedMotion, onExpandEnd, onCollapseEnd } =
      useExpandable()
    const [measureRef, { height }] = useMeasure()
    const smoothHeight = useSpringTo(isExpanded ? height : 0, reducedMotion)

    const base = reducedMotion ? REDUCED_PRESET : preset ? ANIMATION_PRESETS[preset] : undefined
    const initial = reducedMotion ? base?.initial : (animateIn?.initial ?? base?.initial)
    const animate = reducedMotion ? base?.animate : (animateIn?.animate ?? base?.animate)
    const exit = reducedMotion ? base?.exit : (animateOut?.exit ?? base?.exit)
    const transition = animateIn?.transition ?? { duration: transitionDuration, ease: easeType }
    const item = reducedMotion
      ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
      : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

    return (
      <motion.div ref={ref} style={{ ...style, height: smoothHeight, overflow: 'hidden' }} {...props}>
        <AnimatePresence initial={false} onExitComplete={onCollapseEnd}>
          {(isExpanded || keepMounted) && (
            <motion.div
              ref={measureRef}
              initial={initial}
              animate={animate}
              exit={exit}
              transition={transition}
              onAnimationComplete={() => {
                if (isExpanded) onExpandEnd?.()
              }}
            >
              {stagger ? (
                <motion.div
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : staggerChildren } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {Children.map(children as ReactNode, (child, index) => (
                    <motion.div key={index} variants={item}>
                      {child}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                children
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  },
)
ExpandableContent.displayName = 'ExpandableContent'

export const ExpandableCard = forwardRef<HTMLDivElement, ExpandableCardProps>(
  (
    {
      children,
      className,
      collapsedSize = DEFAULT_COLLAPSED,
      expandedSize = DEFAULT_EXPANDED,
      hoverToExpand = false,
      expandDelay = 0,
      collapseDelay = 0,
      ...props
    },
    ref,
  ) => {
    const { isExpanded, toggleExpand, expandDirection, reducedMotion } = useExpandable()
    const [measureRef, { width, height }] = useMeasure()
    const size = isExpanded ? expandedSize : collapsedSize
    const smoothWidth = useSpringTo(size.width || width, reducedMotion)
    const smoothHeight = useSpringTo(size.height || height, reducedMotion)

    const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
    useEffect(() => () => clearTimeout(timer.current), [])
    const schedule = (shouldBeExpanded: boolean, delay: number) => {
      clearTimeout(timer.current)
      if (!hoverToExpand || isExpanded === shouldBeExpanded) return
      timer.current = setTimeout(toggleExpand, delay)
    }

    return (
      <motion.div
        ref={ref}
        className={cn('cursor-pointer', className)}
        style={{
          width: expandDirection === 'vertical' ? collapsedSize.width : smoothWidth,
          height: expandDirection === 'horizontal' ? collapsedSize.height : smoothHeight,
        }}
        onHoverStart={() => schedule(true, expandDelay)}
        onHoverEnd={() => schedule(false, collapseDelay)}
        {...props}
      >
        <div
          className={cn(
            'mx-auto grid w-full grid-cols-1 rounded-lg ring-1 ring-border/50 sm:rounded-xl md:rounded-[2rem]',
            'shadow-[inset_0_0_1px_1px_color-mix(in_oklab,var(--border)_30%,transparent)]',
          )}
        >
          <div className="grid grid-cols-1 rounded-lg p-1 shadow-md sm:rounded-xl sm:p-1.5 md:rounded-[2rem] md:p-2">
            <div className="rounded-md bg-card p-2 text-card-foreground shadow-xl ring-1 ring-border/50 sm:rounded-lg sm:p-3 md:rounded-3xl md:p-4">
              <div className="h-full w-full overflow-hidden">
                <div ref={measureRef} className="flex h-full flex-col">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  },
)
ExpandableCard.displayName = 'ExpandableCard'

export const ExpandableTrigger = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, onClick, onKeyDown, ...props }, ref) => {
    const { isExpanded, toggleExpand } = useExpandable()

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || event.target !== event.currentTarget) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleExpand()
      }
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) toggleExpand()
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ExpandableTrigger.displayName = 'ExpandableTrigger'

export const ExpandableCardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      <motion.div layout className="flex items-start justify-between">
        {children}
      </motion.div>
    </div>
  ),
)
ExpandableCardHeader.displayName = 'ExpandableCardHeader'

export const ExpandableCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('grow overflow-hidden p-6 px-4 pt-0', className)} {...props}>
      <motion.div layout>{children}</motion.div>
    </div>
  ),
)
ExpandableCardContent.displayName = 'ExpandableCardContent'

export const ExpandableCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-4 pt-0', className)} {...props} />
  ),
)
ExpandableCardFooter.displayName = 'ExpandableCardFooter'
