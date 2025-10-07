import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login } from '@redux/store/slices/authSlice';
import LoginScreen from '@screens/Auth/LoginScreen';

// Mock the login thunk
jest.mock('@redux/store/slices/authSlice', () => {
  const original = jest.requireActual('@redux/store/slices/authSlice');
  return {
    ...original,
    login: jest.fn(() => ({ type: 'auth/login' })),
  };
});

describe('LoginScreen', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
  });

  it('dispatches login action when login button is pressed', async () => {
    const spy = jest.spyOn(store, 'dispatch');

    const { getByTestId } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    const button = getByTestId('loginButton');

    fireEvent.press(button);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(login());
    });
  });
});
