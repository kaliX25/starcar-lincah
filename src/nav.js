import { createContext, useContext } from 'react';

export const NavCtx = createContext({ tab: 'today', go: () => {}, openSheet: () => {}, closeSheet: () => {} });
export const useNav = () => useContext(NavCtx);
