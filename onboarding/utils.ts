import { MAX_PET_NAME_LENGTH } from './constants';

/**
 * Formats a pet name for display in UI elements with length constraints
 * Returns the original name if it's not too long, otherwise returns "Pet"
 *
 * @param name The pet name to format
 * @param fallback Optional fallback text (defaults to "Pet")
 * @returns Formatted pet name safe for display in UI elements
 */
export function formatPetNameForDisplay(
  name: string | null | undefined,
  fallback: string = 'Pet',
): string {
  return name && name.length <= MAX_PET_NAME_LENGTH ? name : fallback;
}
