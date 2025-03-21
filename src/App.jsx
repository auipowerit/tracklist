import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./context/Auth/AuthProvider";
import Index from "./pages/Index";
import ErrorPage from "./pages/ErrorPage";
import SpotifyProvider from "./context/Spotify/SpotifyProvider";
import ArtistPage from "./pages/ArtistPage";
import Authenticate from "./pages/Authenticate";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/authenticate",
      element: <Authenticate />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/artists/:artistId",
      element: <ArtistPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <AuthProvider>
      <SpotifyProvider>
        <RouterProvider router={router} />
      </SpotifyProvider>
    </AuthProvider>
  );
}
