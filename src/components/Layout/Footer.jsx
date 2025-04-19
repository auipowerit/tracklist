import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 bg-black/50 p-10 pt-6">
      <p className="space-y-2 text-center text-sm text-gray-400">
        Coded in&nbsp;
        <Link
          to="https://code.visualstudio.com"
          target="_blank"
          className="text-white hover:text-green-700"
        >
          Visual Studio Code&nbsp;
        </Link>
        by&nbsp;
        <Link
          to="https://www.linkedin.com/in/zachary-betters-916a74116/"
          target="_blank"
          className="text-white hover:text-green-700"
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
          className="text-white hover:text-green-700"
        >
          Netlify
        </Link>
        .
        <br />
        All text is set in the&nbsp;
        <Link
          to="https://rsms.me/inter/"
          target="_blank"
          className="text-white hover:text-green-700"
        >
          Inter typeface
        </Link>
        .
      </p>
    </footer>
  );
}
