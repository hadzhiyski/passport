import { Button } from '../ui/button';

export default function AuthButtons() {
  return (
    <div className='flex gap-4 justify-around'>
      <Button asChild variant='link'>
        <a href='/auth/login'>Sign In</a>
      </Button>
      <Button asChild variant='outline'>
        <a href='/auth/login?screen_hint=signup'>Sign Up</a>
      </Button>
    </div>
  );
}
