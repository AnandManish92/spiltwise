import { User } from '../models/User';

class UserService {
  private users: Map<string, User> = new Map();

  addUsers(id: string, name: string) {
    this.users.set(id, { userId: id, name });
  }

  getUser(id: string) : User | undefined {
    return this.users.get(id);
  }

  getUsers(){
    //
  }
}

export default new UserService();