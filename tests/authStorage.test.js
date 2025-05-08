import { describe, it, expect } from 'vitest';
import { saveAuthData, getAuthUser, logout } from '../public/js/utils/authStorage.js';

describe('Auth Storage', () => {
  it('should save and retrieve user data', () => {
    const testUser = { name: 'TestUser', email: 'test@noroff.no' };
    const testToken = '12345';

    saveAuthData(testToken, testUser);

    expect(getAuthUser()).toEqual(testUser);
    expect(localStorage.getItem('authToken')).toBe(testToken);

    logout();
    expect(getAuthUser()).toBeNull();
  });
});