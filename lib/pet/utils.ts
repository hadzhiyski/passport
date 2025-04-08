export function colorToHex(color: string): string {
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    brown: '#964B00',
    tan: '#D2B48C',
    gray: '#808080',
    gold: '#FFD700',
    cream: '#FFFDD0',
    orange: '#FFA500',
  };

  return colorMap[color.toLowerCase()] || '#CCCCCC';
}

export function getSpeciesColor(species: string | null): string {
  const speciesColors: Record<string, string> = {
    dog: 'bg-amber-500',
    cat: 'bg-slate-700',
    bird: 'bg-sky-500',
    rabbit: 'bg-gray-400',
    fish: 'bg-blue-400',
    reptile: 'bg-green-600',
  };

  return speciesColors[(species || '').toLowerCase()] || 'bg-purple-500';
}
