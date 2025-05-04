/**
 * Extracts initials from a pet name
 * - For single names: takes first two characters
 * - For multiple names: takes first letter from each part (up to 2)
 * @param name Pet's name
 * @returns Formatted initials in uppercase
 */
export function getInitials(name: string): string {
  const nameParts = name.split(' ');

  if (nameParts.length === 1) {
    return name.substring(0, 2).toUpperCase();
  } else {
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }
}
