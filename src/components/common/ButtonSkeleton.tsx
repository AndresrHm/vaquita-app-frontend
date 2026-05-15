export default function ButtonSkeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`h-10 animate-pulse rounded-xl bg-muted/60 dark:bg-muted/40 ${className}`} 
      aria-hidden="true"
    />
  )
}