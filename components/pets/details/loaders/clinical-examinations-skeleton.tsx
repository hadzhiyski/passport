import { Skeleton } from '@passport/components/ui/skeleton';

export function ClinicalExaminationsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6'>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='border border-border rounded-lg p-4 shadow-sm bg-card/50'
        >
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='bg-muted/50 p-3 rounded italic text-sm md:col-span-2'>
              <Skeleton className='h-4 w-full mb-2 bg-muted' />
              <Skeleton className='h-4 w-3/4 bg-muted' />
            </div>
            <div>
              <Skeleton className='h-4 w-16 mb-2 bg-muted' />
              <Skeleton className='h-6 w-24 bg-muted' />
            </div>
            <div>
              <Skeleton className='h-4 w-24 mb-2 bg-muted' />
              <Skeleton className='h-6 w-32 bg-muted' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
