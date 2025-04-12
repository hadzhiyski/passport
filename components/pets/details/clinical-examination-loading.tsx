import { Skeleton } from '@passport/components/ui/skeleton';

export function ClinicalExaminationsLoadingSkeleton() {
  return (
    <div className='space-y-6'>
      {[1, 2, 3].map((i) => (
        <div key={i} className='flex justify-between pb-4'>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-6 w-32' />
        </div>
      ))}
    </div>
  );
}
