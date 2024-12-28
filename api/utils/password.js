import bcrypt from 'bcrypt';

class Password {
  static async hashPassword(plainPassword) {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(plainPassword, saltRounds);
    } catch(err) {
      console.log("Hashing error:", err);
      return null;
    }
  }

  static async verifyPassword(plainPassword, hashed) {
    try {
      return await bcrypt.compare(plainPassword, hashed);
    } catch(err) {
      console.log("Hashing error:", err);
      return null;
    }
  }
}

export default Password;
