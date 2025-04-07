import { auth0 } from '@passport/lib/auth0';
import { User as AppUser } from './models';

export async function getUser(): Promise<AppUser | undefined> {
  const session = await auth0.getSession();
  const user = session?.user;

  return user && user.name && user.email
    ? {
        id: user.sub,
        name: user.name,
        initials: user.name
          .split(' ')
          .map((n) => n[0])
          .join(''),
        email: user.email,
        picture: user.picture || '',
      }
    : undefined;
}
