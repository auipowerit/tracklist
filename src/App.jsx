import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import ErrorPage from "./pages/ErrorPage";
import SearchPage from "./pages/SearchPage";
import ArtistPage from "./pages/ArtistPage";
import Authenticate from "./pages/Authenticate";
import AuthProvider from "./context/Auth/AuthProvider";
import SpotifyProvider from "./context/Spotify/SpotifyProvider";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <SearchPage />
        </>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/authenticate",
      element: <Authenticate />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/search",
      element: (
        <>
          <Navbar />
          <SearchPage />
        </>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/artists/:artistId",
      element: (
        <>
          <Navbar />
          <ArtistPage />
        </>
      ),
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
