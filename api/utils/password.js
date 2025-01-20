import bcrypt from 'bcrypt';

class Password {
  static async hashPassword(plainPassword) {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(plainPassword, saltRounds);
    } catch(err) {
      console.error("Error hashing password:", err);
      return null;
    }
  }

  static async verifyPassword(plainPassword, hashed) {
    try {
      return await bcrypt.compare(plainPassword, hashed);
    } catch(err) {
      console.error("Error verifying password:", err);
      return null;
    }
  }
}

export default Password;
