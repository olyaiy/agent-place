import { authClient } from "./auth-client";

// Changed to function that accepts email/password parameters
export async function signIn(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({
    email: email,  // Changed from shorthand to explicit assignment
    password: password,  // Changed from shorthand to explicit assignment
    /**
     * a url to redirect to after the user verifies their email (optional)
     */
    callbackURL: "/dashboard",
    /**
     * remember the user session after the browser is closed. 
     * @default true
     */
    rememberMe: false
  }, {
    // callbacks
  });

  return { data, error };
}