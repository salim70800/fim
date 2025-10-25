import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: 'حول الموقع', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
    { name: 'سياسة الخصوصية', href: '/privacy' },
    { name: 'الشروط والأحكام', href: '/terms' },
  ]

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-right">
            <div className="text-2xl font-bold font-display mb-2">
              <span className="text-primary-500">سينما</span>
              <span className="text-neutral-200">تك</span>
            </div>
            <p className="text-small text-neutral-400">
              منصة البث العربية الشاملة
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-small text-neutral-400 hover:text-neutral-200 transition-colors duration-fast"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
          <p className="text-small text-neutral-400">
            © {currentYear} سينماتك. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
