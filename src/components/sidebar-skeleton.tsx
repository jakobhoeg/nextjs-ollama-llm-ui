import { Skeleton } from '@/components/ui/skeleton';

export default function SidebarSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2 ">
      <div className="flex h-14 w-full items-center justify-between rounded-xl bg-primary/5 p-2">
        <Skeleton className="h-6 w-2/3 rounded-sm" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="flex h-14 w-full items-center justify-between rounded-xl bg-primary/5 p-2 opacity-80">
        <Skeleton className="h-6 w-2/3 rounded-sm" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="flex h-14 w-full items-center justify-between rounded-xl bg-primary/5 p-2 opacity-60">
        <Skeleton className="h-6 w-2/3 rounded-sm" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="flex h-14 w-full items-center justify-between rounded-xl bg-primary/5 p-2 opacity-40">
        <Skeleton className="h-6 w-2/3 rounded-sm" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="flex h-14 w-full items-center justify-between rounded-xl bg-primary/5 p-2 opacity-20">
        <Skeleton className="h-6 w-2/3 rounded-sm" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}
