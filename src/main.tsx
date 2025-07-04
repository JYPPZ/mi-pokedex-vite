import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import ComparePage from './pages/ComparePage.tsx';
import PokemonListPage from './pages/PokemonListPage.tsx';
import PokemonDetailPage from './pages/PokemonDetailPage.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuraciones globales para todas tus queries, por ejemplo:
      staleTime: 1000 * 60 * 5, // Los datos se consideran "frescos" por 5 minutos
      gcTime: 1000 * 60 * 30, // Los datos se mantienen en caché por 30 minutos
      refetchOnWindowFocus: false, // Opcional: evita refetching cada vez que se enfoca la ventana
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'compare',
        element: <ComparePage />, 
      },
      {
        path: 'pokemon',
        element: <PokemonListPage />
      },
      {
        path: 'pokemon/:id',
        element: <PokemonDetailPage />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*
      El QueryClientProvider debe envolver al RouterProvider
      para que los hooks useQuery funcionen en todas las páginas.
    */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);