import { cn } from "@/lib/utils";

type RichContentProps = {
  html: string;
  className?: string;
};

export function RichContent({ html, className }: RichContentProps) {
  return (
    <div
      className={cn(
        "prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-cream prose-p:text-cream/80 prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-li:text-cream/80",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
