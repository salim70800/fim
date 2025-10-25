export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-950 rounded-lg p-8 md:p-12">
            <h1 className="text-h1 font-bold text-neutral-200 mb-8">حول الموقع</h1>
            
            <div className="space-y-6 text-body text-neutral-300 leading-relaxed">
              <p>
                مرحباً بكم في <span className="text-primary-500 font-semibold">سينماتك</span>، منصة البث العربية الشاملة التي تهدف إلى تقديم تجربة مشاهدة متكاملة لأحدث الأفلام، المسلسلات، وحلقات الأنمي بشكل مجاني.
              </p>

              <p>
                نسعى لتوفير واجهة تفاعلية وسريعة مع تصميم عصري يركز على سهولة الاستخدام، الجاذبية البصرية، وسرعة الوصول إلى المحتوى المفضل لديك.
              </p>

              <div className="bg-neutral-800 rounded-lg p-6 my-8">
                <h2 className="text-h3 font-semibold text-neutral-200 mb-4">مهمتنا</h2>
                <p>
                  توفير منصة عربية موثوقة وسهلة الاستخدام تجمع أفضل المحتوى الترفيهي من أفلام ومسلسلات وأنمي في مكان واحد، مع تجربة مشاهدة عالية الجودة.
                </p>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 my-8">
                <h2 className="text-h3 font-semibold text-neutral-200 mb-4">رؤيتنا</h2>
                <p>
                  أن نكون المنصة العربية الأولى للبث المجاني، نقدم محتوى متنوع ومحدث باستمرار يلبي احتياجات جميع أفراد الأسرة العربية.
                </p>
              </div>

              <h2 className="text-h3 font-semibold text-neutral-200 mt-8 mb-4">ما نقدمه</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>مكتبة ضخمة من الأفلام العربية والعالمية</li>
                <li>أحدث المسلسلات المحلية والعالمية</li>
                <li>حلقات الأنمي المدبلجة والمترجمة</li>
                <li>سيرفرات مشاهدة متعددة لضمان التشغيل السلس</li>
                <li>واجهة عربية كاملة مع دعم RTL</li>
                <li>تصميم متجاوب يعمل على جميع الأجهزة</li>
                <li>محرك بحث متقدم مع فلاتر متعددة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
