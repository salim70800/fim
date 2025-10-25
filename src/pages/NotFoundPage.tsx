import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  useEffect(() => {
    // تتبع صفحات 404 للتحليلات
    console.log('404 Page View:', window.location.pathname)
  }, [])

  return (
    <>
      <SEO
        title="الصفحة غير موجودة - 404"
        description="عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها."
        keywords="404, صفحة غير موجودة"
        type="website"
      />

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="text-center">
          {/* الرقم 404 */}
          <div className="relative">
            <h1 className="text-[200px] md:text-[300px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-red-900 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-b from-red-600 to-red-900" />
          </div>

          {/* النص التوضيحي */}
          <div className="mt-8 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              عذراً، الصفحة غير موجودة
            </h2>
            <p className="text-lg text-neutral-400 max-w-md mx-auto">
              يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو ربما لم تكن موجودة من الأساس
            </p>
          </div>

          {/* الروابط السريعة */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              العودة للرئيسية
            </Link>
            <Link
              to="/movies"
              className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              تصفح الأفلام
            </Link>
            <Link
              to="/series"
              className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              تصفح المسلسلات
            </Link>
          </div>

          {/* رسالة البحث */}
          <div className="mt-12 text-neutral-500">
            <p>أو يمكنك</p>
            <Link
              to="/search"
              className="text-red-600 hover:text-red-500 font-medium transition-colors"
            >
              البحث عن محتوى محدد
            </Link>
          </div>

          {/* Structured Data للصفحة */}
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              'name': 'الصفحة غير موجودة - 404',
              'description': 'عذراً، الصفحة التي تبحث عنها غير موجودة',
              'url': window.location.href
            })}
          </script>
        </div>
      </div>
    </>
  )
}
