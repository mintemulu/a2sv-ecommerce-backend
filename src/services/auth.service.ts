import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { signJwt } from '../utils/jwt';

export const register = async (args: { username: string; email: string; password: string }) => {
  const existingEmail = await prisma.user.findUnique({ where: { email: args.email } });
  if (existingEmail) throw { status: 400, message: 'Email already exists' };
  const existingUsername = await prisma.user.findUnique({ where: { username: args.username } });
  if (existingUsername) throw { status: 400, message: 'Username already exists' };

  const passwordHash = await hashPassword(args.password);
  const user = await prisma.user.create({ data: { username: args.username, email: args.email, password: passwordHash } });
  return { id: user.id, username: user.username, email: user.email, role: user.role };
};

export const login = async (args: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: args.email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const valid = await comparePassword(args.password, user.password);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };
  const token = signJwt({ userId: user.id, username: user.username, role: user.role });
  return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
};
