import { users } from "../data/users";
import type { User } from "../bdd/bdd";

export function registerUser(
  email: string,
  username: string,
  password: string
): User {
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: users.length + 1,
    email,
    username,
    password,
  };

  users.push(newUser);
  return newUser;
}

export function loginUser(email: string, password: string): User {
  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return user;
}
