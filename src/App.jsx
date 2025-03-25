import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import ArtistPage from "./pages/ArtistPage";
import Layout from "./components/Layout/Layout";
import AppProviders from "./context/AppProviders";
import ReviewProvider from "./context/Review/ReviewProvider";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ReviewProvider>
              <HomePage />
            </ReviewProvider>
          ),
        },
        {
          path: "/account/login",
          element: <LoginPage />,
        },
        {
          path: "/search",
          element: <SearchPage />,
        },
        {
          path: "/artists/:artistId",
          element: <ArtistPage />,
        },
        {
          path: "/account/*",
          element: <SearchPage />,
        },
        {
          path: "*",
          element: <ErrorPage is404={true} />,
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

function ErrorPage({ error, is404 }) {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center text-5xl">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="text-6xl text-red-500"
      />

      <h1 className="text-3xl font-bold">
        {is404 ? "404 - Page Not Found" : "Oops! Something went wrong :("}
      </h1>
      {error && <p>{error.message}</p>}

      <Link
        to="/"
        className="mt-6 flex w-fit items-center gap-4 rounded-full bg-green-900 px-4 py-2 text-2xl no-underline"
        style={{ textDecoration: "none" }}
      >
        <FontAwesomeIcon icon={faHome} />
        Go to home
      </Link>
    </div>
  );
}
