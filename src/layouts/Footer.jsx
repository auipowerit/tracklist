import { Link } from "react-router-dom";
import "./footer.scss";

export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <p>
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
          .
        </p>
        <p>
          Built with React.js, HTML, SCSS, Spotify API, and Google Firebase.
        </p>
        <p>
          Hosted and deployed with&nbsp;
          <FooterLink link="https://www.netlify.com" label="Netlify" />.
        </p>
        <p>
          All text is set in the&nbsp;
          <FooterLink link="https://rsms.me/inter/" label="Inter typeface" />.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ link, label }) {
  return (
    <Link to={link} target="_blank" className="link-special footer__link">
      {label}
    </Link>
  );
}
