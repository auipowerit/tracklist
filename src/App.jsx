import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import SearchPage from "./pages/SearchPage";
import ArtistPage from "./pages/ArtistPage";
import Authenticate from "./pages/Authenticate";
import Layout from "./components/Layout/Layout";
import AppProviders from "./context/AppProviders";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <SearchPage />
        </Layout>
      ),
    },
    {
      path: "/authenticate",
      element: <Authenticate />,
    },
    {
      path: "/search",
      element: (
        <Layout>
          <SearchPage />
        </Layout>
      ),
    },
    {
      path: "/artists/:artistId",
      element: (
        <Layout>
          <ArtistPage />
        </Layout>
      ),
    },
    {
      path: "/account",
      element: (
        <Layout>
          <SearchPage />
        </Layout>
      ),
    },
    {
      path: "/lists",
      element: (
        <Layout>
          <SearchPage />
        </Layout>
      ),
    },
    {
      path: "/friends",
      element: (
        <Layout>
          <SearchPage />
        </Layout>
      ),
    },
    {
      path: "*",
    },
  ]);

  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}

function ErrorPage({ error }) {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center text-5xl">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="text-6xl text-red-500"
      />

      <h1 className="text-3xl font-bold">{`Oops! Something went wrong :(`}</h1>
      <p>{error.message}</p>

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
