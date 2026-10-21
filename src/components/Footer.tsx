import { BRAND_NAME } from '../content';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          &copy; {YEAR} {BRAND_NAME}. A demo project for the AI Engineer Residency.
        </p>
      </div>
    </footer>
  );
}
