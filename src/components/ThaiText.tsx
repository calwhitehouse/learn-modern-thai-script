import { cn } from "@/lib/cn";

type ThaiTextProps = {
  children: React.ReactNode;
  variant?: "modern" | "looped";
  className?: string;
  as?: "span" | "p" | "div";
};

export function ThaiText({
  children,
  variant = "modern",
  className,
  as: Tag = "span",
}: ThaiTextProps) {
  return (
    <Tag
      className={cn(
        "leading-relaxed text-foreground",
        variant === "modern" ? "font-thai-modern" : "font-thai-looped",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
