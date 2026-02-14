"use client";

import { ReactNode, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// =================== FADE IN ===================
export function FadeIn({ children, delay = 0, direction = 'up', className = '' }: {
    children: ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' | 'none'; className?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const dirMap = { up: { y: 40, x: 0 }, down: { y: -40, x: 0 }, left: { y: 0, x: 40 }, right: { y: 0, x: -40 }, none: { y: 0, x: 0 } };
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: dirMap[direction].y, x: dirMap[direction].x }}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}>
            {children}
        </motion.div>
    );
}

// =================== STAGGER ===================
export function StaggerContainer({ children, className = '', staggerDelay = 0.08 }: {
    children: ReactNode; className?: string; staggerDelay?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-30px' });
    return (
        <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
            className={className}>
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
            className={className}>
            {children}
        </motion.div>
    );
}

// =================== GLASS CARD (Light) ===================
export function GlassCard({ children, className = '', hover = true }: {
    children: ReactNode; className?: string; hover?: boolean;
}) {
    return (
        <motion.div
            whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' } : {}}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-card border border-border rounded-2xl shadow-sm ${className}`}>
            {children}
        </motion.div>
    );
}

// =================== MAGNETIC BUTTON ===================
export function MagneticButton({ children, className = '', ...props }: {
    children: ReactNode; className?: string; onClick?: (e?: React.MouseEvent) => void; type?: 'submit' | 'button';
}) {
    return (
        <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}
            className={`transition-all cursor-pointer ${className}`} {...props}>
            {children}
        </motion.button>
    );
}

// =================== SECTION HEADER ===================
export function SectionHeader({ eyebrow, title, description, className = '' }: {
    eyebrow?: string; title: string; description?: string; className?: string;
}) {
    return (
        <FadeIn className={`text-center max-w-2xl mx-auto mb-16 ${className}`}>
            {eyebrow && <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-brass mb-4">{eyebrow}</span>}
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">{title}</h2>
            {description && <p className="mt-4 text-body leading-relaxed">{description}</p>}
        </FadeIn>
    );
}

// =================== COUNTER ===================
export function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    if (isInView && count === 0) {
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            setCount(current);
        }, 40);
    }

    return <span ref={ref}>{count}{suffix}</span>;
}
