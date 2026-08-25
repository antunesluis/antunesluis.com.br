'use client';

import { Bounce, ToastContainer } from 'react-toastify';
import { useTheme } from 'next-themes';

export function ToastifyContainer() {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position='top-center'
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      transition={Bounce}
    />
  );
}
