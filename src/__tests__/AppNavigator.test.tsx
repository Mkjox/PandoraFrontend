import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@redux/store/slices/authSlice';
import AppNavigator from '@navigation/AppNavigator';

const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

describe('AppNavigator', () => {
  it('renders AuthNavigator when not authenticated', () => {
    const { getByText } = renderWithStore({ auth: { isAuthenticated: false } });
    expect(getByText(/Login/i)).toBeTruthy();
  });

  it('renders MainNavigator when authenticated', () => {
    const { getByText } = renderWithStore({ auth: { isAuthenticated: true } });
    expect(getByText(/Home/i)).toBeTruthy();
  });
});
