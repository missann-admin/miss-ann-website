import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/history", label: "Her Story" },
  { to: "/restore", label: "Restore Miss Ann" },
  { to: "/videos", label: "Videos" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="font-display text-lg">
          Miss Ann &bull; Colonial Beach, Virginia
        </p>
        <p className="mt-1 text-sm text-cream/80">
          Listed on the National Register of Historic Places 1998
        </p>
        <nav aria-label="Footer" className="mt-6">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-cream/90 underline-offset-4 hover:text-brass hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-sm">
          <Link
            to="/restore#signup"
            className="text-brass underline underline-offset-4 hover:text-cream"
          >
            Join the email list for restoration news
          </Link>
        </p>
      </div>
    </footer>
  );
}
