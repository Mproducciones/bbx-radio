'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { staggerContainer, staggerItem, EASE_OUT } from '@/lib/motion/framer'

type StaggerProps = HTMLMotionProps<'div'> & {
  as?: 'div' | 'ul' | 'section'
  itemClassName?: string
}

/** Lista/contenedor con hijos que entran en cascada (Framer) */
export function Stagger({ as = 'div', className, children, ...rest }: StaggerProps) {
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({
  className,
  children,
  ...rest
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div className={className} variants={staggerItem} {...rest}>
      {children}
    </motion.div>
  )
}

export function MotionSection({
  title,
  children,
  className = '',
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      {title ? (
        <h2 className="font-display text-xl md:text-2xl text-white mb-4">{title}</h2>
      ) : null}
      {children}
    </motion.section>
  )
}
