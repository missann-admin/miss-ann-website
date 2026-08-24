import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/history", label: "Her Story" },
  { to: "/restore", label: "Restore Miss Ann" },
  { to: "/videos", label: "Videos" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="border-b-2 border-brass bg-navy text-cream">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-0 text-center">
        <Link to="/" className="inline-block">
          <span className="font-display text-3xl font-semibold tracking-[0.3em] sm:text-4xl">
            MISS&nbsp;ANN
          </span>
          <span className="mt-2 block text-xs font-semibold tracking-[0.25em] text-brass uppercase">
            A 1926 Fantail Motor Yacht
          </span>
        </Link>
      </div>
      <nav aria-label="Primary" className="mx-auto max-w-6xl px-2 pt-5 pb-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-x-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `inline-block border-b-2 px-2 py-1 text-sm font-semibold tracking-wider uppercase transition-colors ${
                    isActive
                      ? "border-brass text-brass"
                      : "border-transparent text-cream hover:border-cream/40"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
