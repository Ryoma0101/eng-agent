import { UserRepository } from '../repositories/user';

export const UserService = {
  async createUser(userId: string, displayName: string, email: string) {
    const existingUser = await UserRepository.FindByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    await UserRepository.createUser(userId, displayName, email);
    return { id: userId, displayName, email };
  },
};
