import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as Pages from "./pages";
import Layout from "./components/Layout/Layout";
import AppProviders from "./context/AppProviders";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Pages.HomePage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/account/authenticate",
          element: <Pages.AuthPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/account/lists",
          element: <Pages.ListsPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/account/lists/:listId",
          element: <Pages.ListPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/search",
          element: <Pages.SearchPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/artists/:artistId",
          element: <Pages.ArtistPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/artists/:artistId/albums/:albumId",
          element: <Pages.AlbumPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/artists/:artistId/albums/:albumId/tracks/:trackId",
          element: <Pages.TrackPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "*",
          element: <Pages.ErrorPage is404={true} />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
      ],
    },
  ]);

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <Pages.ErrorPage {...props} />}
    >
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}
