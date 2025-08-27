import React, { useContext} from 'react';
import AppContext from '@/src/context/app-context';

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
