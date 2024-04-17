// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session.user type
   * Adds the id property to the user object in the session
   */
  interface User {
    id?: string;  // Make sure the property is optional to avoid issues elsewhere
  }

  /**
   * Extends the built-in session type
   * Adds the user type extension to the session object
   */
  interface Session {
    user: User;
  }
}
