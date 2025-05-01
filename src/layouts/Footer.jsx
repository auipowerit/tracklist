import { Link } from "react-router-dom";
import "./footer.scss";

export default function Footer() {
  return (
    <footer>
      <p className="footer-text">
        Coded in&nbsp;
        <FooterLink
          link="https://code.visualstudio.com"
          label="Visual Studio Code"
        />
        &nbsp;by&nbsp;
        <FooterLink
          link="https://www.linkedin.com/in/zachary-betters-916a74116/"
          label="Zachary Betters"
        />
        .&nbsp;
        <br />
        Built with React.js, HTML, SCSS, Spotify API, and Google Firebase.
        Hosted and deployed with&nbsp;
        <FooterLink link="https://www.netlify.com" label="Netlify" />.
        <br />
        All text is set in the&nbsp;
        <FooterLink link="https://rsms.me/inter/" label="Inter typeface" />.
      </p>
    </footer>
  );
}

function FooterLink({ link, label }) {
  return (
    <Link to={link} target="_blank" className="link-special footer-link">
      {label}
    </Link>
  );
}
