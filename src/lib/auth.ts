'use server';

import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const credentialsPath = path.join(process.cwd(), 'admin-credentials.json');

async function getCredentials() {
  try {
    const data = await fs.readFile(credentialsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, create it with default credentials
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const defaultCredentials = {
      username: defaultUsername,
      passwordHash: hashedPassword,
    };
    await fs.writeFile(credentialsPath, JSON.stringify(defaultCredentials, null, 2), 'utf-8');
    return defaultCredentials;
  }
}

export async function verifyCredentials(username: string, password_input: string) {
  const { username: storedUsername, passwordHash } = await getCredentials();
  if (username.toLowerCase() !== storedUsername.toLowerCase()) {
    return false;
  }
  return await bcrypt.compare(password_input, passwordHash);
}

export async function updateCredentials(newUsername: string, newPassword?: string) {
  const currentCredentials = await getCredentials();
  let passwordHash = currentCredentials.passwordHash;

  if (newPassword) {
    passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const newCredentials = {
    username: newUsername,
    passwordHash,
  };

  await fs.writeFile(credentialsPath, JSON.stringify(newCredentials, null, 2), 'utf-8');
  return { success: true, message: 'Credentials updated successfully.' };
}

export async function getAdminUsername() {
    const { username } = await getCredentials();
    return username;
}
