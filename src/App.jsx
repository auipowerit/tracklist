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
          path: "/authenticate",
          element: <Pages.AuthPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/profile",
          element: <Pages.AccountPage />,
          children: [
            {
              index: true,
              element: <Pages.AccountProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/profile/callback",
              element: <Pages.AccountProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
          ],
        },
        {
          path: "/users/:username",
          element: <Pages.AccountPage />,
          children: [
            {
              index: true,
              element: <Pages.AccountProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/users/:username/profile",
              element: <Pages.AccountProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/users/:username/profile/callback",
              element: <Pages.AccountProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/users/:username/reviews",
              element: <Pages.AccountReviews />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/users/:username/lists",
              element: <Pages.AccountLists />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/users/:username/lists/:listId",
              element: <Pages.AccountList />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/users/:username/likes",
              element: <Pages.AccountLikes />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/users/:username/friends",
              element: <Pages.AccountFriends />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
          ],
        },
        {
          path: "/search",
          element: <Pages.SearchPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/artists",
          element: <Pages.ArtistPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
          children: [
            {
              path: "/artists/:artistId",
              element: <Pages.ArtistProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/artists/:artistId/albums/:albumId",
              element: <Pages.AlbumProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
            {
              path: "/artists/:artistId/albums/:albumId/tracks/:trackId",
              element: <Pages.TrackProfile />,
              errorElement: <Pages.ErrorPage is404={false} />,
            },
          ],
        },
        {
          path: "/reviews/:reviewId/",
          element: <Pages.ReviewPage />,
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
