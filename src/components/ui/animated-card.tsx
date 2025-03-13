import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardVariants } from "@/lib/animations";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial" | "variants" | "custom"> {
  children: React.ReactNode;
  className?: string;
  index?: number;
  hover?: boolean;
}

export function AnimatedCard({
  children,
  className,
  index = 0,
  hover = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      initial="hidden"
      animate="visible"
      custom={index}
      variants={cardVariants}
      whileHover={hover ? "hover" : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface AnimatedTextProps extends Omit<HTMLMotionProps<"h3">, "animate" | "initial"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCardTitle({
  className,
  children,
  ...props
}: AnimatedTextProps) {
  return (
    <motion.h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      {...props}
    >
      {children}
    </motion.h3>
  );
}

interface AnimatedParagraphProps extends Omit<HTMLMotionProps<"p">, "animate" | "initial"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCardDescription({
  className,
  children,
  ...props
}: AnimatedParagraphProps) {
  return (
    <motion.p
      className={cn("text-sm text-muted-foreground", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      {...props}
    >
      {children}
    </motion.p>
  );
}

interface AnimatedDivProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCardContent({
  className,
  children,
  ...props
}: AnimatedDivProps) {
  return (
    <motion.div
      className={cn("p-6 pt-0", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCardFooter({
  className,
  children,
  ...props
}: AnimatedDivProps) {
  return (
    <motion.div
      className={cn("flex items-center p-6 pt-0", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
} 