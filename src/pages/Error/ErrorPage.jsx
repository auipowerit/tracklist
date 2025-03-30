import { Link, useRouteError } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export default function ErrorPage({ is404 }) {
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
