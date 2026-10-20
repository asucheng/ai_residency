import { STORE_NAME } from '../content';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          &copy; {YEAR} {STORE_NAME}. A fictional store, built as a demo project.
        </p>
      </div>
    </footer>
  );
}
