import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover, glass, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-surface-low border border-border rounded-2xl",
        hover && "card-hover cursor-pointer",
        glass && "glass-card",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

