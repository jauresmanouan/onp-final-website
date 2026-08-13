import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      // `bg-accent` peignait les squelettes en orange vif, l'accent de la
      // charte n'étant pas un gris neutre ici. La surface sourde est la seule
      // qui se lit comme un contenu en attente.
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
