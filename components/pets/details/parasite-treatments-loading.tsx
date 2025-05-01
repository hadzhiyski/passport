export function ParasiteTreatmentLoadingSkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      {[1, 2].map((i) => (
        <div
          key={i}
          className='bg-card/50 rounded-lg p-4 border border-border space-y-4'
        >
          <div className='flex justify-between items-center'>
            <div className='h-5 bg-muted rounded w-32'></div>
            <div className='h-6 bg-muted rounded w-24'></div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <div className='h-4 bg-muted rounded w-24'></div>
                <div className='h-4 bg-muted rounded w-28'></div>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between'>
                <div className='h-4 bg-muted rounded w-28'></div>
                <div className='h-4 bg-muted rounded w-24'></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
