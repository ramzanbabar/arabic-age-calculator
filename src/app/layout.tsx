import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "حساب العمر بالهجري والميلادي - احسب عمرك بدقة",
  description: "أداة حساب العمر الدقيقة بالتقويم الهجري والميلادي. احسب عمرك بالسنين والشهور والأيام، تعرف على عمرك بالهجري والميلادي، العد التنازلي لعيد ميلادك القادم. حاسبة العمر الأكثر دقة في العالم العربي.",
  keywords: [
    "حساب العمر",
    "حاسبة العمر",
    "احسب عمري",
    "العمر بالهجري",
    "العمر بالميلادي",
    "حساب العمر بالهجري",
    "حساب العمر بالميلادي",
    "تحويل التاريخ الهجري",
    "تحويل التاريخ الميلادي",
    "كم عمري",
    "عمر الانسان",
    "حساب العمر بالسنين",
    "الفرق بين تاريخين",
    "عيد ميلاد",
    "التقويم الهجري",
    "التقويم الميلادي",
    "العمر بالأيام",
    "حساب العمر بدقة"
  ],
  authors: [{ name: "حاسبة العمر" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "حساب العمر بالهجري والميلادي - احسب عمرك بدقة",
    description: "أداة حساب العمر الدقيقة بالتقويم الهجري والميلادي. احسب عمرك بالسنين والشهور والأيام مع العد التنازلي لعيد ميلادك القادم.",
    url: "https://age-calculator.example.com",
    siteName: "حاسبة العمر",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "حساب العمر بالهجري والميلادي",
    description: "احسب عمرك بدقة بالتقويم الهجري والميلادي",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://age-calculator.example.com",
    languages: {
      "ar-SA": "https://age-calculator.example.com",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "حاسبة العمر",
              "alternateName": "حساب العمر بالهجري والميلادي",
              "description": "أداة حساب العمر الدقيقة بالتقويم الهجري والميلادي. احسب عمرك بالسنين والشهور والأيام.",
              "url": "https://age-calculator.example.com",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "SAR",
              },
              "author": {
                "@type": "Organization",
                "name": "حاسبة العمر",
              },
              "inLanguage": "ar-SA",
              "isAccessibleForFree": true,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "كيف أحسب عمري بالهجري؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "أدخل تاريخ ميلادك بالميلادي أو الهجري، وسيقوم الموقع بتحويله وحساب عمرك بدقة في كلا التقويمين. نستخدم تقويم أم القرى الرسمي للحسابات الهجرية.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "هل حساب العمر دقيق؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "نعم، حاسبة العمر هذه دقيقة جداً وتعتمد على مكتبات معتمدة لتحويل التواريخ الهجرية والميلادية. نستخدم تقويم أم القرى المعتمد في السعودية.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "ما الفرق بين التقويم الهجري والميلادي؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "التقويم الهجري يعتمد على دورة القمر ويتكون من 354 أو 355 يوماً، بينما التقويم الميلادي يعتمد على دورة الشمس ويتكون من 365 أو 366 يوماً. لذلك السنة الهجرية أقصر بحوالي 11 يوماً من السنة الميلادية.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "كيف أعرف تاريخ ميلادي الهجري؟",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "إذا كنت تعرف تاريخ ميلادك الميلادي، أدخله في الحاسبة وستحصل على تاريخ ميلادك الهجري المقابل بدقة باستخدام تقويم أم القرى.",
                  },
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "حساب العمر بالهجري والميلادي - احسب عمرك بدقة",
              "description": "أداة حساب العمر الدقيقة بالتقويم الهجري والميلادي",
              "author": {
                "@type": "Organization",
                "name": "حاسبة العمر",
              },
              "inLanguage": "ar-SA",
              "datePublished": "2024-01-01",
              "dateModified": new Date().toISOString().split("T")[0],
            }),
          }}
        />
      </head>
      <body
        className={`${notoSansArabic.variable} font-sans antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-arabic), sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
