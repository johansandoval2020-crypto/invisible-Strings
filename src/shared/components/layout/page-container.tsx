import { cn } from "@/shared/lib/utils";

export function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6 py-10 md:px-10", className)}
      {...props}
    />
  );
}
