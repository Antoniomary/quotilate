import bcrypt from 'bcrypt';

class Password {
  /**
   * Hashes a plain password using bcrypt.
   * @param {string} plainPassword - The plain password to be hashed.
   * @returns {Promise<string | null>} - Returns the hashed password or null if an error occurs.
   */
  static async hashPassword(plainPassword) {
    // The number of rounds to generate the salt for bcrypt
    const saltRounds = 10;

    try {
      // Hash the plain password using bcrypt and return the hashed password
      return await bcrypt.hash(plainPassword, saltRounds);
    } catch(err) {
      // Log an error if hashing fails and return null
      console.error("Error hashing password:", err);
      return null;
    }
  }

   /**
    * Verifies a plain password against a hashed password.
    * @param {string} plainPassword - The plain password to be verified.
    * @param {string} hashed - The hashed password to compare against.
    * @returns {Promise<boolean | null>} - Returns true if the passwords match, false if they don't, or null if an error occurs.
    */
  static async verifyPassword(plainPassword, hashed) {
    try {
      // Compare the plain password with the hashed password and return the result
      return await bcrypt.compare(plainPassword, hashed);
    } catch(err) {
      // Log an error if verification fails and return null
      console.error("Error verifying password:", err);
      return null;
    }
  }
}

// Export the Password class for use in other parts of the application
export default Password;
