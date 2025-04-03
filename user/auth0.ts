import { User as Auth0User } from '@auth0/nextjs-auth0/types';
import { User as AppUser } from './models';

export function createAppUser(
  user: Auth0User | undefined,
): AppUser | undefined {
  if (!user || !user.name || !user.email) {
    return undefined;
  }
  return {
    name: user.name,
    email: user.email,
    picture: user.picture || '',
  };
}
