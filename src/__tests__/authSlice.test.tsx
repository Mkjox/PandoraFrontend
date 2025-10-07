import authReducer, { login, logout } from '@redux/store/slices/authSlice';

describe('authSlice', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: '' })).toEqual({
      isAuthenticated: false,
    });
  });

  it('should handle login', () => {
    const state = authReducer(undefined, login());
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const state = authReducer({ isAuthenticated: true }, logout());
    expect(state.isAuthenticated).toBe(false);
  });
});
