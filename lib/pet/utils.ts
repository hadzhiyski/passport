export function getSpeciesColor(species: string | null): string {
  const speciesColors: Record<string, string> = {
    dog: 'bg-amber-500',
    cat: 'bg-slate-700',
    ferret: 'bg-gray-400',
  };

  return speciesColors[(species || '').toLowerCase()] || 'bg-purple-500';
}
