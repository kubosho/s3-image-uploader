"use client";

import { handleSignIn } from "../../server-actions";

export function SignInButton() {
  return (
    <form action={handleSignIn}>
      <button type="submit">Sign in</button>
    </form>
  );
}
