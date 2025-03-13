import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { pageVariants } from "@/lib/animations";

interface AnimatedContainerProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial" | "variants" | "exit"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedContainer({
  children,
  className,
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      className={cn("space-y-6", className)}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedItemProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial" | "custom"> {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function AnimatedItem({
  children,
  className,
  index = 0,
  ...props
}: AnimatedItemProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
} 