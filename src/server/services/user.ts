import { UserRepository } from '../repositories/user';

export const UserService = {
  async createUser(
    userId: string,
    displayName: string,
    email: string,
    photoURL: string | null = null
  ) {
    const existingUser = await UserRepository.FindByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    await UserRepository.createUser(userId, displayName, email, photoURL);
    return { id: userId, displayName, email, photoURL };
  },

  async FindUserById(uid: string) {
    return await UserRepository.FindUserById(uid);
  },
};
