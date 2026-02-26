import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن - حاسبة العمر | Arabic Tools',
  description: 'تعرف على موقع Arabic Tools - أدوات عربية مجانية لحساب العمر والتحويل بين التقويم الهجري والميلادي بدقة عالية.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">من نحن</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">عن Arabic Tools</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Arabic Tools هو موقع متخصص في تقديم أدوات عربية مفيدة ومجانية للمستخدمين العرب حول العالم. نسعى جاهدين لتوفير أدوات دقيقة وسهلة الاستخدام تلبي احتياجات المستخدمين العرب في مختلف المجالات.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">مهمتنا</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              تتمثل مهمتنا في تسهيل الحياة الرقمية للمستخدمين العرب من خلال توفير أدوات موثوقة ودقيقة تعمل بشكل سلس ومجاني. نؤمن بأن التقنية يجب أن تكون في متناول الجميع، ونسعى لجعل أدواتنا متاحة لكل من يحتاجها.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">حاسبة العمر</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              تُعد حاسبة العمر أحد أهم أدواتنا، حيث تتيح للمستخدمين حساب أعمارهم بدقة بالغة باستخدام التقويم الهجري والميلادي. نستخدم خوارزمية الكويتي (Umm al-Qura) المعتمدة في المملكة العربية السعودية لضمان دقة التحويلات بين التقاويم.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              هذه الأداة تفيد المستخدمين في معرفة أعمارهم بالضبط، سواء للوثائق الرسمية أو للاحتفال بعيد الميلاد أو لمعرفة تاريخ الميلاد المقابل في التقويم الآخر.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">الدقة والجودة</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              نولي الدقة اهتماماً بالغاً في جميع أدواتنا. فريقنا يعمل باستمرار على اختبار وتحديث الخوارزميات المستخدمة لضمان تقديم نتائج موثوقة. نستمع لملاحظات المستخدمين ونعمل على تحسين أدواتنا باستمرار.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">لماذا تختارنا؟</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg mr-4">
              <li>أدوات مجانية تماماً بدون تسجيل أو اشتراك</li>
              <li>دقة عالية في الحسابات والتحويلات</li>
              <li>واجهة عربية سهلة الاستخدام</li>
              <li>سرعة في التنفيذ والنتائج الفورية</li>
              <li>احترام خصوصية المستخدمين</li>
              <li>توافق مع جميع الأجهزة (حاسوب، جوال، تابلت)</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">تواصل معنا</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              نرحب بملاحظاتك واقتراحاتك. إذا كان لديك أي سؤال أو اقتراح لتحسين خدماتنا، لا تتردد في التواصل معنا عبر صفحة التواصل. نسعد بخدمتكم والاستماع لآرائكم.
            </p>
          </section>
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
