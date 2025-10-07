import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  HomeLayout,
  Landing,
  AddUser,
  Login,
  DashboardLayout,
  ErrorPage,
  PlayContainer,
  PlayGame,
  Ranking,
  Stats,
  Profile,
  Admin,
} from './pages';

import { loader as dashboardLoader } from './pages/DashboardLayout';
import { loader as adminLoader } from './pages/Admin';
import { loader as gameLoader } from './pages/PlayGame';
import { loader as statsLoader } from './pages/Stats';
import { loader as rankingLoader } from './pages/Ranking';

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <AddUser />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <PlayContainer />,
          },
          {
            path: 'game1',
            element: <PlayGame game="game1" />,
            loader: () => gameLoader('game1'),
          },
          {
            path: 'game2',
            element: <PlayGame game="game2" />,
            loader: () => gameLoader('game2'),
          },
          {
            path: 'game',
            element: <PlayGame game="game" />,
            loader: () => gameLoader('game'),
          },
          {
            path: 'ranking',
            element: <Ranking />,
            loader: rankingLoader,
          },
          {
            path: 'stats',
            element: <Stats />,
            loader: statsLoader,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
