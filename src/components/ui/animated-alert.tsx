import React from "react";
import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { alertVariants } from "@/lib/animations";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariantStyles = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AnimatedAlertProps
  extends Omit<HTMLMotionProps<"div">, "animate" | "initial" | "variants" | "exit">,
    VariantProps<typeof alertVariantStyles> {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export function AnimatedAlert({
  children,
  className,
  variant,
  visible = true,
  ...props
}: AnimatedAlertProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(alertVariantStyles({ variant }), className)}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={alertVariants}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AnimatedTitleProps extends Omit<HTMLMotionProps<"h5">, "animate" | "initial"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedAlertTitle({
  className,
  children,
  ...props
}: AnimatedTitleProps) {
  return (
    <motion.h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      {...props}
    >
      {children}
    </motion.h5>
  );
}

interface AnimatedDescriptionProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedAlertDescription({
  className,
  children,
  ...props
}: AnimatedDescriptionProps) {
  return (
    <motion.div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
} 