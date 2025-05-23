export function VaccinationsSkeleton() {
  return (
    <div className='space-y-4 animate-pulse'>
      {[...Array(2)].map((_, i) => (
        <div key={i} className='bg-card/50 rounded-lg p-4 border border-border'>
          <div className='flex justify-between mb-4'>
            <div className='h-5 bg-muted rounded w-32'></div>
            <div className='h-5 bg-muted rounded w-24'></div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[...Array(6)].map((_, j) => (
              <div key={j} className='flex justify-between'>
                <div className='h-4 bg-muted rounded w-20'></div>
                <div className='h-4 bg-muted rounded w-24'></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
