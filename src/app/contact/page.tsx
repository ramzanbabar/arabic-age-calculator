"use client";

import { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">تواصل معنا</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <MessageSquare className="w-5 h-5" />
                أرسل رسالة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                يمكنك إرسال رسالة مباشرة من خلال النموذج الموجود في هذه الصفحة.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Mail className="w-5 h-5" />
                البريد الإلكتروني
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                info@arabictools.online
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
                الرد السريع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                نسعى للرد على جميع الرسائل خلال 24-48 ساعة.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="mt-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-700">نموذج التواصل</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">شكراً لك!</h3>
                <p className="text-gray-600">تم إرسال رسالتك بنجاح. سنتواصل معك في أقرب وقت ممكن.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg">الاسم</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="أدخل اسمك"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="text-lg py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="text-lg py-3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-lg">الموضوع</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="موضوع الرسالة"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="text-lg py-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-lg">الرسالة</Label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
                >
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الرسالة
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-700">الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">كيف يمكنني الإبلاغ عن خطأ؟</h3>
              <p className="text-gray-600">يمكنك إرسال رسالة من خلال هذا النموذج مع وصف تفصيلي للمشكلة التي واجهتها.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">هل الخدمات مجانية؟</h3>
              <p className="text-gray-600">نعم، جميع أدواتنا مجانية تماماً ولا تتطلب تسجيل أو اشتراك.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">هل يمكنني اقتراح أداة جديدة؟</h3>
              <p className="text-gray-600">بالتأكيد! نرحب بجميع الاقتراحات. أرسل لنا فكرتك وسندرسها.</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <a href="/" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg">
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
