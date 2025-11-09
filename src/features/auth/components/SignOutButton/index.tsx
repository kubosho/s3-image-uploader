'use client';

import { handleSignOut } from '../../server-actions';

export function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button type="submit">Sign out</button>
    </form>
  );
}
