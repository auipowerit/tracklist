import { ErrorBoundary } from "react-error-boundary";
import {
  createBrowserRouter,
  Link,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import HomePage from "./pages/Home/HomePage";
import AuthPage from "./pages/Auth/AuthPage";
import Layout from "./components/Layout/Layout";
import AlbumPage from "./pages/Artist/AlbumPage";
import TrackPage from "./pages/Artist/TrackPage";
import AppProviders from "./context/AppProviders";
import SearchPage from "./pages/Search/SearchPage";
import ArtistPage from "./pages/Artist/ArtistPage";
import ListsPage from "./pages/Account/Lists/ListsPage";
import ListPage from "./pages/Account/Lists/List/ListPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "/account/authenticate",
          element: <AuthPage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "/account/lists",
          element: <ListsPage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "/account/lists/:listId",
          element: <ListPage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "/search",
          element: <SearchPage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "/artists/:artistId",
          element: <ArtistPage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "/artists/:artistId/albums/:albumId",
          element: <AlbumPage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "/artists/:artistId/albums/:albumId/tracks/:trackId",
          element: <TrackPage />,
          errorElement: <ErrorPage is404={false} />,
        },
        {
          path: "*",
          element: <ErrorPage is404={true} />,
          errorElement: <ErrorPage is404={false} />,
        },
      ],
    },
  ]);

  return (
    <ErrorBoundary FallbackComponent={(props) => <ErrorPage {...props} />}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}

function ErrorPage({ is404 }) {
  const error = useRouteError();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center text-5xl">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="text-6xl text-red-500"
      />

      <h1 className="text-3xl font-bold">
        {is404 ? "404 - Page Not Found" : "Oops! Something went wrong :("}
      </h1>
      {error && <p className="text-2xl text-gray-400">"{error.message}"</p>}

      <Link
        to="/"
        className="mt-6 flex w-fit items-center gap-4 rounded-full bg-green-700 px-4 py-2 text-2xl no-underline"
        style={{ textDecoration: "none" }}
      >
        <FontAwesomeIcon icon={faHome} />
        Go to home
      </Link>
    </div>
  );
}
