import { createContext } from 'react';
import AuthStore from './AuthStore';

export const authStore = new AuthStore();

export const AuthStoreContext = createContext<AuthStore>(authStore);
