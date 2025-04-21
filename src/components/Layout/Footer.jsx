import { Link } from "react-router-dom";
import "src/styles/layout/footer.css";

export default function Footer() {
  return (
    <footer>
      <p className="footer-text">
        Coded in&nbsp;
        <Link
          to="https://code.visualstudio.com"
          target="_blank"
          className="footer-link"
        >
          Visual Studio Code&nbsp;
        </Link>
        by&nbsp;
        <Link
          to="https://www.linkedin.com/in/zachary-betters-916a74116/"
          target="_blank"
          className="footer-link"
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
          className="footer-link"
        >
          Netlify
        </Link>
        .
        <br />
        All text is set in the&nbsp;
        <Link
          to="https://rsms.me/inter/"
          target="_blank"
          className="footer-link"
        >
          Inter typeface
        </Link>
        .
      </p>
    </footer>
  );
}
