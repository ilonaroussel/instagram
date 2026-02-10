
import { registerUser, loginUser } from "../../backend/services/auth";

export const api = {
  register: async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    return registerUser(data.email, data.username, data.password);
  },

  login: async (data: {
    email: string;
    password: string;
  }) => {
    return loginUser(data.email, data.password);
  }
};
