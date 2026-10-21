import { BRAND_NAME, NAV_LINKS } from '../content';

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          {BRAND_NAME}
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
        <a href="#quote" className="button button-small">
          Request a quote
        </a>
      </div>
    </header>
  );
}
