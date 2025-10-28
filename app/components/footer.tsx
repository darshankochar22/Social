import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav aria-label="Footer" className="footer-grid justify-items-end md:grid-cols-5">
          <section className="text-right">
            <h3 className="footer-heading">Get the app</h3>
            <ul className="footer-list">
              <li>
                <Link
                  href="/ios"
                  className="footer-link"
                >
                  iOS
                </Link>
              </li>
              <li>
                <Link
                  href="/android"
                  className="footer-link"
                >
                  Android
                </Link>
              </li>
            </ul>
          </section>

          <section className={'hidden md:block text-right'}>
            <h3 className="footer-heading">Quick links</h3>
            <ul className="grid grid-cols-2 gap-2 md:block md:space-y-2">
              <li><Link href="/explore" className="footer-link">Explore</Link></li>
              <li><Link href="/shop" className="footer-link">Shop</Link></li>
              <li><Link href="/users" className="footer-link">Users</Link></li>
              <li><Link href="/collections" className="footer-link">Collections</Link></li>
              <li><Link href="/shopping" className="footer-link">Shopping</Link></li>
              <li><Link href="/help" className="footer-link">Help Centre</Link></li>
            </ul>
          </section>

          <section className={'hidden md:block text-right'}>
            <h3 className="footer-heading">Policies</h3>
            <ul className="footer-list">
              <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/non-user-notice" className="footer-link">Non-user notice</Link></li>
            </ul>
          </section>

          <section className={'hidden md:block text-right'}>
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-list">
              <li><Link href="/docs" className="footer-link">Documentation</Link></li>
              <li><Link href="/blog" className="footer-link">Blog</Link></li>
              <li><Link href="/guides" className="footer-link">Guides</Link></li>
              <li><Link href="/status" className="footer-link">Status</Link></li>
            </ul>
          </section>

          <section className={'hidden md:block text-right'}>
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-list">
              <li><Link href="/about" className="footer-link">About</Link></li>
              <li><Link href="/careers" className="footer-link">Careers</Link></li>
              <li><Link href="/press" className="footer-link">Press</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </section>
        </nav>

        <div className="footer-divider" id="footer-more">
          <p className="text-xs text-gray-400">© {year} Pinterest</p>
        </div>
      </div>
    </footer>
  );
}