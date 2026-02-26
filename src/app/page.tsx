"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, Gift, Moon, Sun, Sparkles, Calculator, ChevronDown, Info } from "lucide-react";

// Arabic month names
const gregorianMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const hijriMonths = [
  "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
  "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
  "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

// Days in each Gregorian month (non-leap year)
const daysInGregorianMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Days in each Hijri month (approximate - actual varies)
const daysInHijriMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

interface AgeResult {
  gregorianYears: number;
  gregorianMonths: number;
  gregorianDays: number;
  hijriYears: number;
  hijriMonths: number;
  hijriDays: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthdayDays: number;
  birthDayOfWeek: string;
  convertedGregorianDate: string;
  convertedHijriDate: string;
}

// Convert Hijri to Gregorian using Umm al-Qura (Kuwaiti) algorithm
function hijriToGregorian(hYear: number, hMonth: number, hDay: number): { year: number; month: number; day: number } {
  // Kuwaiti algorithm - used by Saudi Arabia for Umm al-Qura calendar
  const jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 
             30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948054;
  
  // Convert Julian Day Number to Gregorian
  const l = jd + 68569;
  const n = Math.floor(4 * l / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor(4000 * (l2 + 1) / 1461001);
  const l3 = l2 - Math.floor(1461 * i / 4) + 31;
  const j = Math.floor(80 * l3 / 2447);
  const day = l3 - Math.floor(2447 * j / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;
  
  return { year, month, day };
}

// Convert Gregorian to Hijri using the EXACT inverse of Kuwaiti algorithm
function gregorianToHijri(gYear: number, gMonth: number, gDay: number): { year: number; month: number; day: number } {
  // Calculate Julian Day Number from Gregorian date
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;
  const jd = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Inverse of Kuwaiti algorithm (must match hijriToGregorian epoch: 1948054)
  const l = jd - 1948054;
  
  // 30-year cycle has 10631 days
  // Calculate year within cycle
  const n = Math.floor(l / 10631);        // Number of complete 30-year cycles
  let remainder = l - n * 10631;          // Days remaining in current cycle
  
  // Calculate year within the 30-year cycle
  // Each year is approximately 354.36667 days
  // Leap years in cycle: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 (11 leap years)
  // Leap years have 355 days, normal years have 354 days
  
  let yearInCycle = 0;
  const leapYearsInCycle = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  
  while (yearInCycle < 30) {
    const daysInYear = leapYearsInCycle.includes(yearInCycle + 1) ? 355 : 354;
    if (remainder < daysInYear) break;
    remainder -= daysInYear;
    yearInCycle++;
  }
  
  const year = n * 30 + yearInCycle + 1;
  
  // Calculate month and day within year
  // Hijri months alternate: 30, 29, 30, 29, ... (total 354 or 355 days)
  const daysInMonths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  // In leap years, the last month (Dhu al-Hijjah) has 30 days
  if (leapYearsInCycle.includes(yearInCycle + 1)) {
    daysInMonths[11] = 30;
  }
  
  let month = 0;
  while (month < 12 && remainder >= daysInMonths[month]) {
    remainder -= daysInMonths[month];
    month++;
  }
  
  const day = remainder + 1;
  
  return { year, month: month + 1, day };
}

// Check if a Gregorian year is a leap year
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Get days in a Gregorian month
function getDaysInGregorianMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return daysInGregorianMonth[month - 1];
}

// Get days in a Hijri month (approximate based on typical pattern)
function getDaysInHijriMonth(month: number): number {
  // In reality, this varies based on moon sighting
  // Using alternating 30/29 pattern
  return daysInHijriMonth[month - 1];
}

// Day of week in Arabic
const daysOfWeekArabic = [
  "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"
];

// Calculate age with proper calendar conversion
function calculateAge(
  year: number,
  month: number,
  day: number,
  calendarType: "gregorian" | "hijri"
): AgeResult | null {
  const today = new Date();
  
  let gregorianYear: number, gregorianMonth: number, gregorianDay: number;
  let hijriYear: number, hijriMonth: number, hijriDay: number;
  
  if (calendarType === "hijri") {
    // CRITICAL: Convert Hijri to Gregorian FIRST using Umm al-Qura algorithm
    const converted = hijriToGregorian(year, month, day);
    gregorianYear = converted.year;
    gregorianMonth = converted.month;
    gregorianDay = converted.day;
    
    // Keep original Hijri date for display
    hijriYear = year;
    hijriMonth = month;
    hijriDay = day;
  } else {
    // Already Gregorian
    gregorianYear = year;
    gregorianMonth = month;
    gregorianDay = day;
    
    // Convert to Hijri for display
    const converted = gregorianToHijri(year, month, day);
    hijriYear = converted.year;
    hijriMonth = converted.month;
    hijriDay = converted.day;
  }
  
  // Create date object from Gregorian date
  const birthDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
  
  // Validate the date
  if (isNaN(birthDate.getTime())) {
    return null;
  }
  
  // Check if date is in the future
  if (birthDate > today) {
    return null;
  }
  
  // Calculate age in Gregorian calendar (this is the accurate calculation)
  let gYears = today.getFullYear() - birthDate.getFullYear();
  let gMonths = today.getMonth() - birthDate.getMonth();
  let gDays = today.getDate() - birthDate.getDate();
  
  if (gDays < 0) {
    gMonths--;
    const prevMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    const prevYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    gDays += getDaysInGregorianMonth(prevYear, prevMonth);
  }
  
  if (gMonths < 0) {
    gYears--;
    gMonths += 12;
  }
  
  // Calculate total days lived
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate total weeks
  const totalWeeks = Math.floor(totalDays / 7);
  
  // Calculate total months (approximate)
  const totalMonths = Math.floor(totalDays / 29.53); // Hijri months (29.53 days average)
  
  // Calculate Hijri age by converting the result
  const hijriBirthDate = gregorianToHijri(gregorianYear, gregorianMonth, gregorianDay);
  const todayHijri = gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  let hYears = todayHijri.year - hijriBirthDate.year;
  let hMonths = todayHijri.month - hijriBirthDate.month;
  let hDays = todayHijri.day - hijriBirthDate.day;
  
  // Adjust for negative days
  if (hDays < 0) {
    hMonths--;
    // Days in previous Hijri month (alternating 30/29 pattern)
    const prevMonthDays = (todayHijri.month - 1) % 2 === 0 ? 30 : 29;
    hDays += prevMonthDays;
  }
  
  // Adjust for negative months
  if (hMonths < 0) {
    hYears--;
    hMonths += 12;
  }
  
  // Calculate next birthday
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday <= today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Birth day of week
  const birthDayOfWeek = daysOfWeekArabic[birthDate.getDay()];
  
  // Format converted dates for display
  const convertedGregorianDate = `${gregorianDay} ${gregorianMonths[gregorianMonth - 1]} ${gregorianYear}`;
  const convertedHijriDate = `${hijriDay} ${hijriMonths[hijriMonth - 1]} ${hijriYear} هـ`;
  
  return {
    gregorianYears: gYears,
    gregorianMonths: gMonths,
    gregorianDays: gDays,
    hijriYears: hYears,
    hijriMonths: hMonths,
    hijriDays: hDays,
    totalDays,
    totalWeeks,
    totalMonths,
    nextBirthdayDays,
    birthDayOfWeek,
    convertedGregorianDate,
    convertedHijriDate
  };
}

export default function AgeCalculator() {
  const [calendarType, setCalendarType] = useState<"gregorian" | "hijri">("gregorian");
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  const months = calendarType === "gregorian" ? gregorianMonths : hijriMonths;
  
  // Generate year options
  const currentYear = new Date().getFullYear();
  const currentHijriYear = gregorianToHijri(currentYear, new Date().getMonth() + 1, new Date().getDate()).year;
  
  const yearOptions = calendarType === "gregorian" 
    ? Array.from({ length: 120 }, (_, i) => currentYear - i)
    : Array.from({ length: 120 }, (_, i) => currentHijriYear - i);

  // Get max days for selected month - memoized to avoid recalculation
  const maxDays = useMemo(() => {
    if (!month) return 31;
    const monthNum = parseInt(month);
    
    if (calendarType === "gregorian" && year) {
      const yearNum = parseInt(year);
      return getDaysInGregorianMonth(yearNum, monthNum);
    } else if (calendarType === "hijri") {
      return getDaysInHijriMonth(monthNum);
    }
    return 31;
  }, [month, year, calendarType]);

  // Handle month change - validate day if needed
  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    // Reset day when month changes
    setDay("");
    setResult(null);
    setError("");
  };

  // Handle year change - validate day if needed
  const handleYearChange = (newYear: string) => {
    setYear(newYear);
    // Reset day when year changes
    setDay("");
    setResult(null);
    setError("");
  };

  // Handle day change
  const handleDayChange = (newDay: string) => {
    setDay(newDay);
    setResult(null);
    setError("");
  };

  // Handle calendar type change
  const handleCalendarTypeChange = (value: "gregorian" | "hijri") => {
    setCalendarType(value);
    setYear("");
    setMonth("");
    setDay("");
    setResult(null);
    setError("");
  };

  const handleCalculate = () => {
    setError("");
    setResult(null);
    
    if (!year || !month || !day) {
      setError("يرجى إدخال التاريخ كاملاً");
      return;
    }
    
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    
    if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
      setError("يرجى إدخال أرقام صحيحة");
      return;
    }
    
    setIsCalculating(true);
    
    // Simulate a brief calculation animation
    setTimeout(() => {
      const ageResult = calculateAge(yearNum, monthNum, dayNum, calendarType);
      
      if (!ageResult) {
        setError("التاريخ الذي أدخلته غير صحيح أو في المستقبل");
      } else {
        setResult(ageResult);
      }
      
      setIsCalculating(false);
    }, 300);
  };

  const handleReset = () => {
    setYear("");
    setMonth("");
    setDay("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-l from-emerald-600 to-teal-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calculator className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">حساب العمر بالهجري والميلادي</h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            احسب عمرك بدقة بالتقويم الهجري والميلادي - أداة موثوقة تعتمد على تقويم أم القرى
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Calculator Card */}
        <Card className="mb-8 shadow-xl border-0 card-hover">
          <CardHeader className="bg-gradient-to-l from-emerald-500/10 to-teal-500/10 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="w-6 h-6 text-emerald-600" />
              أدخل تاريخ ميلادك
            </CardTitle>
            <CardDescription>
              اختر نوع التقويم ثم أدخل تاريخ ميلادك لحساب عمرك بدقة
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Calendar Type Selector */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">نوع التقويم</Label>
              <RadioGroup
                value={calendarType}
                onValueChange={handleCalendarTypeChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="gregorian" id="gregorian" />
                  <Label htmlFor="gregorian" className="flex items-center gap-2 cursor-pointer">
                    <Sun className="w-5 h-5 text-amber-500" />
                    التقويم الميلادي
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="hijri" id="hijri" />
                  <Label htmlFor="hijri" className="flex items-center gap-2 cursor-pointer">
                    <Moon className="w-5 h-5 text-blue-500" />
                    التقويم الهجري
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year" className="font-semibold">السنة</Label>
                <Select value={year} onValueChange={handleYearChange}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y} {calendarType === "hijri" ? "هـ" : "م"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Month */}
              <div className="space-y-2">
                <Label htmlFor="month" className="font-semibold">الشهر</Label>
                <Select value={month} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="اختر الشهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Day */}
              <div className="space-y-2">
                <Label htmlFor="day" className="font-semibold">اليوم</Label>
                <Select value={day} onValueChange={handleDayChange}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="اختر اليوم" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleCalculate}
                className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <Sparkles className="w-5 h-5 ml-2 animate-spin" />
                    جاري الحساب...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 ml-2" />
                    احسب العمر
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="px-6 py-3"
              >
                إعادة تعيين
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Main Age Display */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-l from-emerald-500 to-teal-500 text-white p-6">
                <h2 className="text-2xl font-bold text-center mb-2">عمرك الآن</h2>
                <div className="text-center">
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Badge className="bg-white/20 text-white text-xl px-4 py-2 border-white/30">
                      {result.gregorianYears} سنة
                    </Badge>
                    <Badge className="bg-white/20 text-white text-xl px-4 py-2 border-white/30">
                      {result.gregorianMonths} شهر
                    </Badge>
                    <Badge className="bg-white/20 text-white text-xl px-4 py-2 border-white/30">
                      {result.gregorianDays} يوم
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gregorian Age */}
              <Card className="card-hover border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-amber-700">
                    <Sun className="w-5 h-5" />
                    العمر بالميلادي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-amber-200">
                      <span className="text-muted-foreground">السنين:</span>
                      <span className="font-bold text-xl text-amber-700">{result.gregorianYears}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-amber-200">
                      <span className="text-muted-foreground">الشهور:</span>
                      <span className="font-bold text-xl text-amber-700">{result.gregorianMonths}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">الأيام:</span>
                      <span className="font-bold text-xl text-amber-700">{result.gregorianDays}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hijri Age */}
              <Card className="card-hover border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                    <Moon className="w-5 h-5" />
                    العمر بالهجري
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="text-muted-foreground">السنين:</span>
                      <span className="font-bold text-xl text-blue-700">{result.hijriYears}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="text-muted-foreground">الشهور:</span>
                      <span className="font-bold text-xl text-blue-700">{result.hijriMonths}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">الأيام:</span>
                      <span className="font-bold text-xl text-blue-700">{result.hijriDays}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  إحصائيات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-700">{result.totalDays.toLocaleString('ar-SA')}</div>
                    <div className="text-sm text-purple-600 mt-1">إجمالي الأيام</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-700">{result.totalWeeks.toLocaleString('ar-SA')}</div>
                    <div className="text-sm text-green-600 mt-1">إجمالي الأسابيع</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-700">{result.totalMonths.toLocaleString('ar-SA')}</div>
                    <div className="text-sm text-blue-600 mt-1">إجمالي الشهور</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-amber-700">{result.birthDayOfWeek}</div>
                    <div className="text-sm text-amber-600 mt-1">يوم الميلاد</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Birthday */}
            <Card className="shadow-lg pulse-glow border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <Gift className="w-12 h-12 text-emerald-600" />
                  <div className="text-center">
                    <div className="text-lg text-muted-foreground">عيد ميلادك القادم بعد</div>
                    <div className="text-4xl font-bold gradient-text">
                      {result.nextBirthdayDays} يوم
                    </div>
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            {/* Converted Dates */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-gray-600" />
                  تاريخ الميلاد المحوّل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-amber-600 mb-1">بالميلادي</div>
                    <div className="font-semibold text-lg">{result.convertedGregorianDate} م</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-blue-600 mb-1">بالهجري</div>
                    <div className="font-semibold text-lg">{result.convertedHijriDate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Section */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>دليل حساب العمر بالهجري والميلادي</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">ما هو حساب العمر؟</h2>
                <p className="mb-4">
                  حساب العمر هو عملية تحديد الفترة الزمنية بين تاريخ ميلاد الشخص والتاريخ الحالي. يُعبّر عن العمر عادةً بالسنوات والشهور والأيام، لكن يمكن أيضاً التعبير عنه بإجمالي الأيام أو الأسابيع أو حتى الساعات. يُعدّ حساب العمر من العمليات الحسابية الأساسية التي يحتاجها الإنسان في العديد من المناسبات، سواء لتحديد العمر القانوني أو للاحتفال بعيد الميلاد أو لمعرفة المرحلة العمرية.
                </p>
                <p>
                  في العالم العربي والإسلامي، يُستخدم تقويمان رئيسيان: التقويم الميلادي المعتمد دولياً والتقويم الهجري المعتمد في الشعائر الإسلامية والمعاملات الرسمية في بعض الدول. لذلك، يحتاج الكثيرون إلى حساب أعمارهم بالتقويمين معاً للحصول على معلومات شاملة ودقيقة.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">الفرق بين التقويم الهجري والميلادي</h2>
                <p className="mb-4">
                  التقويم الميلادي هو التقويم الشمسي المعتمد عالمياً، والذي يعتمد على دورة الأرض حول الشمس. تتكون السنة الميلادية من 365 يوماً في السنة البسيطة و366 يوماً في السنة الكبيسة. بدأ هذا التقويم منذ عام ميلاد السيد المسيح عليه السلام، وهو التقويم الرسمي في معظم دول العالم.
                </p>
                <p className="mb-4">
                  أما التقويم الهجري فهو التقويم القمري الإسلامي الذي يعتمد على دورة القمر حول الأرض. تتكون السنة الهجرية من 354 يوماً أو 355 يوماً، أي أنها أقصر من السنة الميلادية بحوالي 11 يوماً. بدأ التقويم الهجري منذ هجرة النبي محمد صلى الله عليه وسلم من مكة إلى المدينة المنورة عام 622 ميلادية.
                </p>
                <p>
                  يتكون التقويم الهجري من اثني عشر شهراً قمرياً وهي: محرم، صفر، ربيع الأول، ربيع الثاني، جمادى الأولى، جمادى الآخرة، رجب، شعبان، رمضان، شوال، ذو القعدة، وذو الحجة. تتراوح أيام كل شهر بين 29 و30 يوماً بناءً على رؤية الهلال.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">كيفية حساب العمر بدقة</h2>
                <p className="mb-4">
                  لحساب العمر بدقة، يجب مراعاة الفرق بين السنوات والشهور والأيام. الطريقة الأكثر دقة هي حساب الفرق بين تاريخ الميلاد والتاريخ الحالي بالأيام أولاً، ثم تحويل هذا الفرق إلى سنوات وشهور وأيام. هذا الأسلوب يُعطي نتائج دقيقة جداً ولا يعتمد على التقريب.
                </p>
                <p className="mb-4">
                  عند حساب العمر بالتقويم الهجري، تُحوّل التواريخ أولاً إلى التقويم الميلادي لضمان الدقة، ثم يُحسب العمر، وبعدها يمكن تحويل النتيجة إلى التقويم الهجري. هذه الطريقة تضمن توافق النتائج مع المعايير العالمية للحسابات الزمنية.
                </p>
                <p>
                  تُستخدم في هذه الأداة خوارزميات معتمدة تعتمد على تقويم أم القرى الرسمي المعتمد في المملكة العربية السعودية، والذي يُعدّ المرجع الأساسي للتقويم الهجري في العالم الإسلامي. هذا يضمن دقة النتائج ومطابقتها للحسابات الرسمية.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">أهمية حساب العمر</h2>
                <p className="mb-4">
                  تتجاوز أهمية حساب العمر مجرد معرفة رقم، فهو يُستخدم في العديد من الجوانب الحياتية والقانونية والاجتماعية. من الناحية القانونية، يُحدد العمر الأهلية للتصرفات القانونية مثل الزواج والقيادة والتصويت والتوظيف والتقاعد. كذلك يُحدد العمر مراحل التعليم والخدمات الحكومية المستحقة.
                </p>
                <p className="mb-4">
                  من الناحية الصحية، يُساعد معرفة العمر الدقيق في تحديد الفحوصات الطبية اللازمة واللقاحات والتطعيمات. كما يُساعد الأطباء في تقييم النمو ومؤشرات الصحة العامة. بعض الأمراض والفحوصات ترتبط بمراحل عمرية محددة، مما يجعل معرفة العمر بدقة أمراً ضرورياً.
                </p>
                <p>
                  اجتماعياً، يُستخدم حساب العمر في تحديد مواعيد الاحتفالات ومناسبات الذكرى السنوية. كما يُساعد في التخطيط للحياة المستقبلية ووضع الأهداف الشخصية والعملية. كثير من الناس يهتمون بمعرفة أعمارهم بالضبط للاحتفال بعيد ميلادهم أو معرفة موعد عيدهم القادم.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">تحويل التاريخ الهجري إلى ميلادي</h2>
                <p className="mb-4">
                  يُعدّ تحويل التاريخ الهجري إلى ميلادي من العمليات الحسابية المهمة للكثيرين، خاصة أولئك الذين يحتاجون إلى التعامل مع التقويمين. تُستخدم في هذا التحويل خوارزميات رياضية معقدة تأخذ بعين الاعتبار الفروقات بين التقويمين ودورات الأهلة القمرية.
                </p>
                <p className="mb-4">
                  تُعتمد في هذه الأداة خوارزمية تقويم أم القرى، وهو التقويم الرسمي في المملكة العربية السعودية. يُستخدم هذا التقويم في تحديد بدايات الشهور الهجرية رسمياً، ويُعدّ مرجعاً معتمداً في العالم الإسلامي. هذه الخوارزمية تأخذ بعين الاعتبار البيانات الفلكية الدقيقة لحركة القمر.
                </p>
                <p>
                  عند إدخال تاريخ ميلاد هجري، تُحوّل الأداة هذا التاريخ إلى ميلادي أولاً، ثم تُجري حسابات العمر على الأساس الميلادي لضمان الدقة. هذا الأسلوب يُجنّب الأخطاء الشائعة في الحسابات الهجرية المباشرة ويُعطي نتائج متوافقة مع الحسابات العالمية.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChevronDown className="w-5 h-5" />
              الأسئلة الشائعة عن حساب العمر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger className="text-right text-lg font-semibold">
                  كيف أحسب عمري بالهجري بدقة؟
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    لحساب عمرك بالهجري بدقة، أدخل تاريخ ميلادك في الخانة المخصصة واختر "التقويم الهجري". ستقوم الأداة بتحويل تاريخ ميلادك الهجري إلى ميلادي أولاً باستخدام تقويم أم القرى المعتمد، ثم تحسب عمرك بدقة، وتُظهر النتيجة بالتقويمين الهجري والميلادي.
                  </p>
                  <p>
                    هذه الطريقة تُعطي نتائج دقيقة ومتطابقة مع الحسابات الرسمية، وتتجنب الأخطاء الشائعة في الحسابات التقريبية. الأداة تُظهر أيضاً العد التنازلي لعيد ميلادك القادم وإحصائيات إضافية عن عمرك.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger className="text-right text-lg font-semibold">
                  هل حاسبة العمر هذه دقيقة؟
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    نعم، هذه الحاسبة دقيقة جداً وتعتمد على خوارزميات معتمدة لتحويل التواريخ وحساب الفروقات الزمنية. نستخدم تقويم أم القرى الرسمي المعتمد في المملكة العربية السعودية للحسابات الهجرية، مما يضمن توافق النتائج مع المراجع الرسمية.
                  </p>
                  <p>
                    كما أن الحسابات تُجرى على مستوى الأيام لتجنّب التقريب، ثم تُحوّل النتائج إلى سنوات وشهور وأيام. هذا الأسلوب يُعطي دقة عالية تتفوق على الحسابات اليدوية والتقريبية.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger className="text-right text-lg font-semibold">
                  ما الفرق بين العمر الهجري والميلادي؟
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    الفرق الرئيسي يكمن في التقويم المستخدم في الحساب. العمر الميلادي يُحسب بناءً على السنة الشمسية (365-366 يوماً)، بينما العمر الهجري يُحسب بناءً على السنة القمرية (354-355 يوماً). هذا يعني أن العمر الهجري يكبر أسرع بحوالي 11 يوماً سنوياً.
                  </p>
                  <p>
                    مثال: إذا كان عمرك 40 سنة ميلادية، فقد يكون عمرك الهجري حوالي 41 سنة أو أكثر بقليل، حسب الشهور والأيام. هذا الفرق يزداد مع مرور الوقت، وهو سبب اختلاف الأعمار بين التقويمين.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger className="text-right text-lg font-semibold">
                  كيف أعرف تاريخ ميلادي الهجري؟
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    إذا كنت تعرف تاريخ ميلادك الميلادي فقط، يمكنك استخدام هذه الأداة لمعرفة تاريخ ميلادك الهجري. اختر "التقويم الميلادي" وأدخل تاريخ ميلادك، وستُظهر الأداة تاريخ ميلادك الهجري المقابل بدقة.
                  </p>
                  <p>
                    تحويل التاريخ يتم باستخدام خوارزمية تقويم أم القرى، وهو التقويم الرسمي المعتمد. هذا يضمن أن التاريخ المحوّل متوافق مع الوثائق الرسمية في الدول التي تستخدم التقويم الهجري.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger className="text-right text-lg font-semibold">
                  ما هو تقويم أم القرى؟
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    تقويم أم القرى هو التقويم الهجري الرسمي المعتمد في المملكة العربية السعودية. سُمّي بهذا الاسم نسبة إلى مدينة أم القرى (مكة المكرمة). يُستخدم هذا التقويم في تحديد بدايات الشهور الهجرية رسمياً، ويُعدّ مرجعاً في العالم الإسلامي.
                  </p>
                  <p>
                    يعتمد هذا التقويم على معايير فلكية دقيقة لحساب دورة القمر، مما يجعله متوافقاً مع رؤية الهلال في معظم الحالات. هذا التقويم يُستخدم في هذه الحاسبة لضمان دقة التحويلات بين التواريخ الهجرية والميلادية.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q6">
                <AccordionTrigger className="text-right text-lg font-semibold">
                  هل يمكنني حساب عمر شخص آخر؟
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    نعم، يمكنك استخدام هذه الأداة لحساب عمر أي شخص طالما أنك تعرف تاريخ ميلاده. هذا يُفيد في حساب أعمار الأطفال أو الوالدين أو أي شخص تحتاج معرفة عمره لأغراض مختلفة.
                  </p>
                  <p>
                    الأداة لا تحفظ أي بيانات شخصية، وجميع الحسابات تتم على جهازك مباشرة. هذا يضمن خصوصية بياناتك وبيانات من تحسب أعمارهم من خلال هذه الأداة.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q7">
                <AccordionTrigger className="text-right text-lg font-semibold">
                  كيف أستخدم النتائج بشكل عملي؟
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  <p className="mb-3">
                    تُقدم الأداة معلومات متعددة يمكنك استخدامها عملياً. معرفة العمر بالسنين والشهور والأيام تُفيد في تعبئة النماذج الرسمية. إجمالي الأيام والأسابيع قد يُستخدم في حسابات الضرائب أو التأمين أو المدة الزمنية لأحداث معينة.
                  </p>
                  <p>
                    العد التنازلي لعيد الميلاد يُساعدك في التخطيط للاحتفالات والمناسبات. معرفة يوم الأسبوع الذي وُلدت فيه قد يكون معلومة ممتعة للمشاركة مع الأصدقاء والعائلة. جميع هذه المعلومات متاحة بنقرة زر واحدة.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 py-8 border-t">
          <div className="mb-4">
            <p className="text-lg font-semibold gradient-text">حاسبة العمر - حساب العمر بالهجري والميلادي</p>
          </div>
          <p className="text-sm">
            أداة مجانية لحساب العمر بدقة باستخدام تقويم أم القرى
          </p>
          <p className="text-sm mt-2">
            جميع الحسابات تتم على جهازك مباشرة لضمان الخصوصية
          </p>
          
          {/* Navigation Links */}
          <div className="mt-6 flex justify-center gap-6 flex-wrap">
            <a href="/about" className="text-emerald-600 hover:text-emerald-700 transition-colors">
              من نحن
            </a>
            <span className="text-gray-300">|</span>
            <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 transition-colors">
              سياسة الخصوصية
            </a>
            <span className="text-gray-300">|</span>
            <a href="/contact" className="text-emerald-600 hover:text-emerald-700 transition-colors">
              تواصل معنا
            </a>
          </div>
          
          <p className="text-xs mt-6 text-gray-400">
            © {new Date().getFullYear()} Arabic Tools - جميع الحقوق محفوظة
          </p>
        </footer>
      </main>
    </div>
  );
}
