import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - حاسبة العمر | Arabic Tools',
  description: 'سياسة الخصوصية لموقع Arabic Tools - نحترم خصوصيتك ونحمي بياناتك. تعرف على كيفية تعاملنا مع معلوماتك.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">سياسة الخصوصية</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">مقدمة</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              نحن في Arabic Tools نلتزم بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا الإلكتروني arabictools.online وأدواته المختلفة بما في ذلك حاسبة العمر.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">جمع المعلومات</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              موقعنا يعمل بالكامل على جانب العميل (Client-Side)، مما يعني أن جميع الحسابات والمعالجات تتم على جهازك مباشرة. نحن:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg mr-4">
              <li>لا نجمع أي بيانات شخصية من المستخدمين</li>
              <li>لا نخزن تواريخ الميلاد أو نتائج الحسابات</li>
              <li>لا نستخدم ملفات تعريف الارتباط للتتبع</li>
              <li>لا نشارك أي معلومات مع أطراف ثالثة</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              قد نستخدم ملفات تعريف ارتباط ضرورية فقط لتحسين تجربة التصفح، مثل تذكر إعدادات اللغة أو الوضع الداكن. هذه الملفات لا تحتوي على أي معلومات شخصية ولا تُستخدم للتتبع أو الإعلانات.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">أمان البيانات</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              نظراً لأن جميع العمليات تتم محلياً على جهازك، فإن بياناتك لا تُرسل إلى أي خادم. هذا يعني أن خصوصيتك محمية بشكل كامل. لا يمكننا الوصول إلى أي معلومات تدخلها في الأدوات.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">الروابط الخارجية</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              قد يحتوي موقعنا على روابط لمواقع خارجية. نحن غير مسؤولين عن ممارسات الخصوصية لهذه المواقع. ننصحك بمراجعة سياسة الخصوصية الخاصة بكل موقع تزوره.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">التحديثات على السياسة</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ آخر تعديل. ننصحك بمراجعة هذه السياسة بشكل دوري.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">حقوق المستخدم</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              بما أننا لا نجمع بيانات شخصية، فلا حاجة للقلق بشأن حقوق حذف البيانات أو الوصول إليها. ومع ذلك، إذا كان لديك أي استفسار، يمكنك التواصل معنا.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">تواصل معنا</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو الممارسات المتعلقة بها، يرجى التواصل معنا عبر صفحة التواصل المتاحة على موقعنا.
            </p>
          </section>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              آخر تحديث: فبراير 2024
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg">
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
