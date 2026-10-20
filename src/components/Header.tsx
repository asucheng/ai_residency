import { NAV_LINKS, STORE_NAME } from '../content';

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          {STORE_NAME}
        </a>
        <nav aria-label="Main">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#waitlist" className="button button-small">
          Join the waitlist
        </a>
      </div>
    </header>
  );
}
