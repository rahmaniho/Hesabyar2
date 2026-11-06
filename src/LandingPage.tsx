import { useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  Folder,
  Menu,
  Package,
  Receipt,
  Sparkles,
  Users,
  Wallet,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onOpenDemo: () => void;
}

const features = [
  { icon: Receipt, title: 'فروش و فاکتورها', text: 'فهرست فاکتورهای نمونه را مرتب ببینید و وضعیت هر مورد را سریع مرور کنید.' },
  { icon: Users, title: 'مشتریان', text: 'یک نمای ساده از دفتر مشتریان و اطلاعات نمایشی هر پرونده.' },
  { icon: Package, title: 'کالا و انبار', text: 'کالاها و تعدادهای نمونه را در یک فهرست روشن کنار هم ببینید.' },
  { icon: Wallet, title: 'دریافت و پرداخت', text: 'گردش‌های ساختگی صندوق و حساب‌ها را بدون ثبت عملیات واقعی مرور کنید.' },
  { icon: BarChart3, title: 'نمای کلی', text: 'خلاصهٔ شاخص‌ها و نمودارهای نمایشی برای یک نگاه سریع.' },
  { icon: FileText, title: 'گزارش‌ها', text: 'با چیدمان گزارش‌ها آشنا شوید؛ در این پیش‌نمایش فایلی ساخته نمی‌شود.' },
];

const questions = [
  {
    question: 'این نسخه به حساب واقعی من وصل می‌شود؟',
    answer: 'خیر. این صفحه و پیش‌نمایش برنامه فقط برای نمایش رابط هستند و به حساب، سرویس یا پایگاه داده‌ای وصل نمی‌شوند.',
  },
  {
    question: 'اطلاعاتی که در پیش‌نمایش می‌بینم واقعی است؟',
    answer: 'خیر. همهٔ نام‌ها، فاکتورها، مبالغ و تعدادها ساختگی‌اند. لطفاً اطلاعات واقعی مشتری یا کسب‌وکار را وارد نکنید.',
  },
  {
    question: 'می‌توانم فروش یا پرداخت ثبت کنم؟',
    answer: 'نه. هیچ فروش، دریافت، پرداخت یا تغییر موجودی انجام نمی‌شود؛ دکمه‌ها فقط مسیرهای نمایشی رابط را نشان می‌دهند.',
  },
];

const chartHeights = [32, 48, 40, 66, 55, 76, 60, 88, 72, 96, 68, 82];

export default function LandingPage({ onOpenDemo }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const openDemo = () => {
    closeMobileMenu();
    onOpenDemo();
  };

  return (
    <div className="landing-page" dir="rtl">
      <header className="landing-header" id="top">
        <div className="landing-container landing-header-inner">
          <a className="landing-brand" href="#top" aria-label="کارو، ابتدای صفحه" onClick={closeMobileMenu}>
            <img className="landing-brand-logo" src={`${import.meta.env.BASE_URL}karo-logo.png`} alt="" aria-hidden="true" />
          </a>

          <nav className={`landing-nav ${mobileMenuOpen ? 'is-open' : ''}`} id="landing-navigation" aria-label="بخش‌های صفحه">
            <a href="#features" onClick={closeMobileMenu}>امکانات</a>
            <a href="#benefits" onClick={closeMobileMenu}>چرا کارو؟</a>
            <a href="#how-it-works" onClick={closeMobileMenu}>نحوهٔ آشنایی</a>
            <a href="#faq" onClick={closeMobileMenu}>پرسش‌های رایج</a>
          </nav>

          <div className="landing-header-actions">
            <button className="landing-header-demo" type="button" onClick={openDemo}>دموی تعاملی <ArrowLeft size={16} /></button>
            <button
              className="landing-menu-toggle"
              type="button"
              aria-label={mobileMenuOpen ? 'بستن ناوبری' : 'باز کردن ناوبری'}
              aria-expanded={mobileMenuOpen}
              aria-controls="landing-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-copy">
              <span className="landing-kicker"><Sparkles size={15} /> حساب‌وکتاب، یک قدم ساده‌تر</span>
              <h1>برای مدیریت کسب‌وکارت، <span>یک نگاه روشن‌تر</span></h1>
              <p>کارو تجربه‌ای فارسی و منظم برای دیدن فروش، مشتریان و کالاهاست؛ همه در یک پیش‌نمایش ساده و قابل‌فهم.</p>
              <div className="landing-hero-actions">
                <button className="landing-primary-button" type="button" onClick={openDemo}>مشاهدهٔ پیش‌نمایش <ArrowLeft size={17} /></button>
                <a className="landing-secondary-link" href="#features">آشنایی با امکانات <ChevronDown size={15} /></a>
              </div>
              <div className="landing-hero-notes">
                <span><Check size={15} /> محیط فارسی و راست‌چین</span>
                <span><Check size={15} /> داده‌های نمونه، بدون اطلاعات واقعی</span>
              </div>
            </div>

            <div className="landing-hero-visual">
              <div className="landing-orbit landing-orbit-one" />
              <div className="landing-orbit landing-orbit-two" />
              <div className="landing-floating-note"><span className="landing-floating-icon"><BarChart3 size={16} /></span><span><strong>نمای کلی</strong><small>فقط دادهٔ نمایشی</small></span><span className="landing-floating-dot" /></div>
              <div className="landing-preview-window" role="img" aria-label="تصویر ساختگی از پیش‌نمایش داشبورد کارو">
                <div className="landing-preview-topbar">
                  <div className="landing-preview-brand"><span>ک</span><strong>کارو</strong></div>
                  <span className="landing-demo-tag"><span /> پیش‌نمایش</span>
                </div>
                <div className="landing-preview-heading"><div><small>خلاصهٔ روز · نمونه</small><strong>نمای کلی فروشگاه</strong></div><span>این ماه <ChevronDown size={12} /></span></div>
                <div className="landing-preview-stats">
                  <div className="landing-preview-stat"><span className="landing-stat-icon stat-mint"><Receipt size={14} /></span><small>فروش امروز · نمونه</small><strong>۱۲,۸۴۰,۰۰۰ <em>تومان</em></strong></div>
                  <div className="landing-preview-stat"><span className="landing-stat-icon stat-blue"><Users size={14} /></span><small>فاکتورهای امروز · نمونه</small><strong>۳۲ <em>فاکتور</em></strong></div>
                </div>
                <div className="landing-preview-chart-card">
                  <div className="landing-preview-card-heading"><span><strong>روند فروش</strong><small>نمودار ساختگی</small></span><span className="landing-chart-label">این ماه</span></div>
                  <div className="landing-mini-chart" aria-hidden="true">
                    <div className="landing-chart-guides"><i /><i /><i /></div>
                    <div className="landing-chart-bars">{chartHeights.map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
                  </div>
                  <div className="landing-chart-months"><span>۱ مهر</span><span>۱۵ مهر</span><span>۳۰ مهر</span></div>
                </div>
                <div className="landing-preview-activity"><span className="landing-activity-check"><Check size={12} /></span><span><strong>گردش‌های اخیر</strong><small>همهٔ مبالغ و نام‌ها نمونه‌اند</small></span><span className="landing-activity-link">نمایش</span></div>
              </div>
              <div className="landing-floating-card"><span className="landing-floating-check"><Check size={13} /></span><span><strong>چیدمان ساده</strong><small>برای یک نگاه سریع</small></span></div>
            </div>
          </div>
          <div className="landing-hero-glow" aria-hidden="true" />
        </section>

        <section className="landing-value-strip" aria-label="ویژگی‌های پیش‌نمایش">
          <div className="landing-container landing-value-inner">
            <span className="landing-value-title">یک شروع مرتب برای آشنایی با:</span>
            <span><Receipt size={17} /> فروش و فاکتور</span>
            <span><Users size={17} /> مشتریان</span>
            <span><Package size={17} /> کالا و انبار</span>
            <span><BarChart3 size={17} /> نمای کلی</span>
          </div>
        </section>

        <section className="landing-section landing-features" id="features">
          <div className="landing-container">
            <div className="landing-section-heading">
              <span className="landing-section-kicker">امکانات پیش‌نمایش</span>
              <h2>چیزهای روزمره، <span>یک‌جا و مرتب</span></h2>
              <p>ساختار صفحه‌ها را ببینید و با مسیرهای اصلی برنامه آشنا شوید؛ بدون ورود اطلاعات واقعی.</p>
            </div>
            <div className="landing-feature-grid">
              {features.map(({ icon: Icon, title, text }) => (
                <article className="landing-feature-card" key={title}>
                  <div className="landing-feature-illustration" aria-hidden="true">
                    <Folder className="landing-feature-folder" strokeWidth={1.05} />
                    <span className="landing-feature-pictogram"><Icon size={21} /></span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <button className="landing-feature-action" type="button" onClick={openDemo}>مشاهده در پیش‌نمایش <ArrowLeft size={14} /></button>
                </article>
              ))}
            </div>
            <p className="landing-prototype-disclaimer"><CircleHelp size={15} /> این نسخه فقط پیش‌نمایش رابط است؛ داده‌ها ساختگی‌اند و هیچ عملیات مالی یا ذخیره‌سازی انجام نمی‌شود.</p>
          </div>
        </section>

        <section className="landing-benefits" id="benefits">
          <div className="landing-container landing-benefits-grid">
            <div className="landing-benefits-copy">
              <span className="landing-section-kicker">سادگی در تجربه</span>
              <h2>به‌جای شلوغی، <span>یک نمای روشن</span></h2>
              <p>رابط کارو با تمرکز بر راست‌چین بودن، خوانایی و دسترسی سریع به بخش‌های مهم طراحی شده است.</p>
              <ul>
                <li><span><Check size={14} /></span><div><strong>ساختار قابل‌فهم</strong><small>مسیرهای اصلی در منوی ساده و مشخص</small></div></li>
                <li><span><Check size={14} /></span><div><strong>هماهنگ با زبان فارسی</strong><small>چیدمان راست‌چین و تایپوگرافی فارسی</small></div></li>
                <li><span><Check size={14} /></span><div><strong>پیش‌نمایش امن</strong><small>بدون اتصال به حساب یا دادهٔ واقعی</small></div></li>
              </ul>
              <button className="landing-text-button" type="button" onClick={openDemo}>گشت‌وگذار در پیش‌نمایش <ArrowLeft size={16} /></button>
            </div>
            <div className="landing-benefit-art" aria-hidden="true">
              <div className="landing-benefit-backdrop" />
              <div className="landing-benefit-card landing-benefit-card-main">
                <span className="landing-benefit-card-kicker">خلاصهٔ نمونه</span>
                <strong>کارها، مرتب‌تر</strong>
                <div className="landing-benefit-progress"><span /></div>
                <div className="landing-benefit-lines"><i /><i /><i /></div>
                <div className="landing-benefit-total"><span>فروش امروز · نمایشی</span><strong>۱۲,۸۴۰,۰۰۰ تومان</strong></div>
              </div>
              <div className="landing-benefit-card landing-benefit-card-small"><span className="landing-benefit-mini-icon"><Check size={14} /></span><span><strong>اطلاعات ساختگی</strong><small>هیچ داده‌ای ذخیره نمی‌شود</small></span></div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-steps" id="how-it-works">
          <div className="landing-container">
            <div className="landing-section-heading">
              <span className="landing-section-kicker">سه قدم کوتاه</span>
              <h2>اول ببینید، بعد <span>تصمیم بگیرید</span></h2>
              <p>این پیش‌نمایش برای آشنایی با تجربهٔ برنامه ساخته شده، نه برای ثبت اطلاعات واقعی.</p>
            </div>
            <div className="landing-step-grid">
              <article><span className="landing-step-number">۱</span><h3>با صفحه‌ها آشنا شوید</h3><p>نمای کلی و بخش‌های اصلی را در یک محیط نمایشی مرور کنید.</p></article>
              <article><span className="landing-step-number">۲</span><h3>جزئیات رابط را ببینید</h3><p>فهرست‌ها، فیلترها و جزئیات نمونه را بدون ثبت عملیات امتحان کنید.</p></article>
              <article><span className="landing-step-number">۳</span><h3>بازخورد بدهید</h3><p>نیازهای واقعی کسب‌وکارتان را مشخص کنید تا مسیر بعدی روشن‌تر شود.</p></article>
            </div>
          </div>
        </section>

        <section className="landing-faq" id="faq">
          <div className="landing-container landing-faq-grid">
            <div className="landing-faq-intro">
              <span className="landing-section-kicker">پرسش‌های رایج</span>
              <h2>پیش از شروع، <span>بدانید</span></h2>
              <p>این صفحه برای معرفی نمونهٔ فعلی است. دربارهٔ مرزهای پیش‌نمایش شفاف باشید.</p>
              <span className="landing-faq-bubble"><CircleHelp size={20} /> هنوز پرسشی دارید؟</span>
            </div>
            <div className="landing-faq-list">
              {questions.map((item, index) => {
                const isOpen = openQuestion === index;
                return (
                  <article className={`landing-faq-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
                    <h3>
                      <button type="button" aria-expanded={isOpen} aria-controls={`landing-faq-${index}`} onClick={() => setOpenQuestion(isOpen ? null : index)}>
                        <span>{item.question}</span><ChevronDown size={18} />
                      </button>
                    </h3>
                    <div className="landing-faq-answer" id={`landing-faq-${index}`} hidden={!isOpen}><p>{item.answer}</p></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-final-cta">
          <div className="landing-container landing-final-cta-inner">
            <div><span className="landing-final-icon"><Wallet size={21} /></span><h2>کارو را در عمل ببینید</h2><p>پیش‌نمایش تعاملی را باز کنید؛ بدون ثبت‌نام و بدون دادهٔ واقعی.</p></div>
            <button className="landing-primary-button landing-primary-light" type="button" onClick={openDemo}>رفتن به پیش‌نمایش <ArrowLeft size={17} /></button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <a className="landing-brand" href="#top" aria-label="بازگشت به ابتدای صفحه" onClick={closeMobileMenu}>
            <img className="landing-brand-logo" src={`${import.meta.env.BASE_URL}karo-logo.png`} alt="" aria-hidden="true" />
          </a>
          <p>پیش‌نمایش رابط کارو ۲.۰ · داده‌ها ساختگی و غیرقابل ذخیره‌سازی هستند.</p>
          <a className="landing-back-to-top" href="#top">ابتدای صفحه <ArrowLeft size={14} /></a>
        </div>
      </footer>
    </div>
  );
}
