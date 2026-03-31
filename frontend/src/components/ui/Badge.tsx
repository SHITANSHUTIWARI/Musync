import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "premium";
  className?: string;
}

const variants = {
  default: "bg-surface-highest text-foreground border-border/40",
  secondary: "bg-surface-high text-muted-foreground border-transparent",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  outline: "bg-transparent text-foreground border-white/10",
  premium: "signature-gradient text-white border-transparent shadow-glow-sm font-black",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

