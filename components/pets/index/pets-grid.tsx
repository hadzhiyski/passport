import { fetchPets } from '@passport/pets/pets-index';
import { getUserId, getUserOwnerId } from '@passport/user';
import { NoPets } from './no-pets';
import { PetCard } from './pet-card';

export async function PetsGrid({
  sortBy,
  filterStatus,
  filterSpecies,
  searchQuery,
}: {
  sortBy: string;
  filterStatus: string;
  filterSpecies: string;
  searchQuery: string;
}) {
  const userId = await getUserId();
  const ownerId = await getUserOwnerId();

  if (!userId || !ownerId) {
    return (
      <div className='container py-16 flex flex-col items-center'>
        <h1 className='text-2xl font-bold text-foreground'>
          Please log in to view your pets.
        </h1>
      </div>
    );
  }

  let pets = await fetchPets(userId, ownerId);

  // Apply filtering
  if (filterStatus === 'needs-attention') {
    pets = pets.filter((pet) => pet.healthStatus.needsAttention);
  } else if (filterStatus === 'expiring-soon') {
    pets = pets.filter((pet) => pet.soonExpiring.length > 0);
  }

  if (filterSpecies !== 'all') {
    pets = pets.filter(
      (pet) => pet.species.toLowerCase() === filterSpecies.toLowerCase(),
    );
  }

  // Apply search filtering
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    pets = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(query) ||
        (pet.breed && pet.breed.toLowerCase().includes(query)),
    );
  }

  // Apply sorting
  if (sortBy === 'age-asc') {
    pets.sort((a, b) => {
      const ageA = new Date(a.dob).getTime();
      const ageB = new Date(b.dob).getTime();
      // Youngest first = most recent DOB first = higher timestamp value first
      return ageB - ageA; // Reversed to get youngest first (newer dates have higher timestamp)
    });
  } else if (sortBy === 'age-desc') {
    pets.sort((a, b) => {
      const ageA = new Date(a.dob).getTime();
      const ageB = new Date(b.dob).getTime();
      // Oldest first = earliest DOB first = lower timestamp value first
      return ageA - ageB; // Reversed to get oldest first (older dates have lower timestamp)
    });
  } else if (sortBy === 'attention') {
    pets.sort((a, b) => {
      const needsAttentionA = a.healthStatus.needsAttention ? 1 : 0;
      const needsAttentionB = b.healthStatus.needsAttention ? 1 : 0;
      return needsAttentionB - needsAttentionA;
    });
  } else {
    pets.sort((a, b) => a.name.localeCompare(b.name));
  }

  return pets.length === 0 ? (
    <NoPets hasSearch={!!searchQuery} />
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
