import { ErrorBoundary } from "react-error-boundary";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import * as Pages from "./pages";
import Layout from "./layouts/Layout";
import AppProviders from "./pages/AppProviders";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" />,
        },
        {
          path: "/home",
          element: <Pages.HomePage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/reviews/:reviewId/",
          element: <Pages.ReviewPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/search",
          element: <Pages.SearchPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/artists",
          element: <Pages.MediaPage />,
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
          path: "/authenticate",
          element: <Pages.AuthPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/authenticate/callback",
          element: <Pages.AuthPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/messages",
          element: <Pages.ChatPage />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
        {
          path: "/inbox",
          element: <Pages.InboxPage />,
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
          path: "*",
          element: <Pages.ErrorPage is404={true} />,
          errorElement: <Pages.ErrorPage is404={false} />,
        },
      ],
    },
  ]);

  return (
    <AppProviders>
      <RouterProvider router={router}>
        <ErrorBoundary
          FallbackComponent={(props) => <Pages.ErrorPage {...props} />}
        />
      </RouterProvider>
    </AppProviders>
  );
}
