export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-950 rounded-lg p-8 md:p-12">
            <h1 className="text-h1 font-bold text-neutral-200 mb-8">اتصل بنا</h1>
            
            <div className="space-y-6 text-body text-neutral-300">
              <p>
                نحن سعداء بتواصلك معنا. يمكنك التواصل معنا من خلال الوسائل التالية:
              </p>

              <div className="bg-neutral-800 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-h3 font-semibold text-neutral-200 mb-2">البريد الإلكتروني</h3>
                  <a href="mailto:info@cinematech.com" className="text-primary-500 hover:text-primary-400">
                    info@cinematech.com
                  </a>
                </div>

                <div className="border-t border-neutral-700 pt-4">
                  <h3 className="text-h3 font-semibold text-neutral-200 mb-2">وسائل التواصل الاجتماعي</h3>
                  <div className="flex gap-4 mt-3">
                    <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                      فيسبوك
                    </a>
                    <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                      تويتر
                    </a>
                    <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                      إنستغرام
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 mt-8">
                <h3 className="text-h3 font-semibold text-neutral-200 mb-4">ساعات العمل</h3>
                <p className="text-neutral-300">
                  نحن متاحون للرد على استفساراتكم على مدار الساعة طوال أيام الأسبوع.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
