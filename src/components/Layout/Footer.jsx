import { Link } from "react-router-dom";

export default function Footer() {
  function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="mt-10 flex flex-col items-center gap-2 p-10">
      <p className="space-y-2 text-center text-sm text-gray-400">
        Coded in&nbsp;
        <Link
          to="https://code.visualstudio.com"
          target="_blank"
          className="text-white"
        >
          Visual Studio Code&nbsp;
        </Link>
        by&nbsp;
        <Link
          to="https://www.linkedin.com/in/zachary-betters-916a74116/"
          target="_blank"
          className="text-white"
        >
          Zachary Betters
        </Link>
        .&nbsp;
        <br />
        Built with React.JS, HTML, Tailwind CSS, Spotify API, and Firebase.
        Hosted and deployed with&nbsp;
        <Link
          to="https://www.netlify.com"
          target="_blank"
          className="text-white"
        >
          Netlify
        </Link>
        .
        <br />
        All text is set in the&nbsp;
        <Link
          to="https://rsms.me/inter/"
          target="_blank"
          className="text-white"
        >
          Inter typeface
        </Link>
        .
      </p>
    </footer>
  );
}
