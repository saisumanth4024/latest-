import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, { logout, setCredentials, checkTokenExpiration } from './authSlice';

const baseUser = { id: '1', username: 'demo', role: 'user' } as any;

const initialState = authReducer(undefined, { type: 'init' });

describe('authSlice reducers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('sets credentials and authenticates the user', () => {
    const state = authReducer(
      initialState,
      setCredentials({
        user: baseUser,
        token: 'token',
        refreshToken: 'refresh',
        expiresAt: 123,
      })
    );

    expect(state.user).toEqual(baseUser);
    expect(state.token).toBe('token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('clears state on logout', () => {
    const loggedIn = authReducer(
      initialState,
      setCredentials({ user: baseUser, token: 't', refreshToken: 'r', expiresAt: 1 })
    );

    const state = authReducer(loggedIn, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('checkTokenExpiration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('dispatches refresh when token is expired and refresh token exists', () => {
    const dispatch = vi.fn();
    const now = Date.now();
    vi.setSystemTime(now);
    const getState = () => ({
      auth: { expiresAt: Math.floor(now / 1000) - 10, refreshToken: 'r' }
    });

    const result = checkTokenExpiration()(dispatch, getState as any);

    expect(result).toBe(true);
    expect(dispatch).toHaveBeenCalled();
  });

  it('dispatches logout when expired without refresh token', () => {
    const dispatch = vi.fn();
    const now = Date.now();
    vi.setSystemTime(now);
    const getState = () => ({
      auth: { expiresAt: Math.floor(now / 1000) - 10, refreshToken: null }
    });

    const result = checkTokenExpiration()(dispatch, getState as any);

    expect(result).toBe(true);
    expect(dispatch).toHaveBeenCalled();
  });

  it('returns false when token is valid', () => {
    const dispatch = vi.fn();
    const now = Date.now();
    vi.setSystemTime(now);
    const getState = () => ({
      auth: { expiresAt: Math.floor(now / 1000) + 100, refreshToken: 'r' }
    });

    const result = checkTokenExpiration()(dispatch, getState as any);

    expect(result).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
