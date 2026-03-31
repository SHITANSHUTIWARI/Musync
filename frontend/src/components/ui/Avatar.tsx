import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  return (
    <div className={cn("relative rounded-full overflow-hidden flex-shrink-0 bg-surface-highest", sizes[size], className)}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full signature-gradient flex items-center justify-center font-bold text-primary-foreground tracking-wider">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
