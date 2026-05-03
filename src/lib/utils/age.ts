// src/lib/utils/age.ts

/**
 * Calculates age in years from a birthDate string or Date object.
 * Returns null if the date is invalid — never throws.
 *
 * Safe for serialized ISO strings from the DB (StudentSerialized.birthDate).
 */
export function calculateAge(birthDate: string | Date | undefined | null): number | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}