import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
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

type BillingCycle = 'monthly' | 'annual';
type PurchaseStep = 'signup' | 'review' | 'complete';

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  featured?: boolean;
  features: string[];
}

interface SignupDetails {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'start',
    name: 'شروع',
    tagline: 'برای یک شروع منظم',
    monthlyPrice: 249000,
    annualPrice: 2490000,
    features: ['یک کاربر', 'فروش و فاکتور', 'دفتر مشتریان', 'گزارش‌های پایه'],
  },
  {
    id: 'growth',
    name: 'رشد',
    tagline: 'برای کسب‌وکارهای در حال توسعه',
    monthlyPrice: 499000,
    annualPrice: 4990000,
    featured: true,
    features: ['تا ۵ کاربر', 'فروش، مشتری و انبار', 'گزارش‌های مدیریتی', 'پشتیبانی سریع‌تر'],
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    tagline: 'برای تیم‌های پرکار',
    monthlyPrice: 899000,
    annualPrice: 8990000,
    features: ['تا ۱۰ کاربر', 'همهٔ بخش‌های اصلی', 'گزارش‌های پیشرفته', 'اولویت پشتیبانی'],
  },
];

const formatToman = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount);

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
  {
    question: 'ثبت‌نام و خرید اشتراک در این صفحه واقعی است؟',
    answer: 'خیر. قیمت‌ها و پلن‌ها نمونه‌اند و فرم سفارش فقط جریان رابط را نشان می‌دهد؛ حسابی ساخته نمی‌شود، اطلاعات به جایی ارسال نمی‌شود و مبلغی کسر نمی‌شود.',
  },
];

const chartHeights = [32, 48, 40, 66, 55, 76, 60, 88, 72, 96, 68, 82];

export default function LandingPage({ onOpenDemo }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const purchaseTrigger = useRef<HTMLElement | null>(null);
  const selectedPlan = pricingPlans.find((plan) => plan.id === selectedPlanId) ?? null;
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const openDemo = () => {
    closeMobileMenu();
    onOpenDemo();
  };
  const openPurchase = (planId: string, trigger: HTMLElement) => {
    closeMobileMenu();
    purchaseTrigger.current = trigger;
    setSelectedPlanId(planId);
  };
  const closePurchase = () => setSelectedPlanId(null);

  useEffect(() => {
    if (selectedPlanId !== null) return;
    if (purchaseTrigger.current?.isConnected) purchaseTrigger.current.focus();
    purchaseTrigger.current = null;
  }, [purchaseTrigger, selectedPlanId]);

  return (
    <div className="landing-page" dir="rtl">
      <header className="landing-header" id="top">
        <div className="landing-container landing-header-inner">
          <a className="landing-brand" href="#top" aria-label="کارو، ابتدای صفحه" onClick={closeMobileMenu}>
            <img className="landing-brand-logo" src={`${import.meta.env.BASE_URL}karo-logo.png`} alt="" aria-hidden="true" />
          </a>

          <nav className={`landing-nav ${mobileMenuOpen ? 'is-open' : ''}`} id="landing-navigation" aria-label="بخش‌های صفحه">
            <a href="#features" onClick={closeMobileMenu}>امکانات</a>
            <a href="#pricing" onClick={closeMobileMenu}>پلن‌ها</a>
            <a href="#benefits" onClick={closeMobileMenu}>چرا کارو؟</a>
            <a href="#how-it-works" onClick={closeMobileMenu}>نحوهٔ آشنایی</a>
            <a href="#faq" onClick={closeMobileMenu}>پرسش‌های رایج</a>
          </nav>

          <div className="landing-header-actions">
            <a className="landing-header-signup" href="#pricing" onClick={closeMobileMenu}>ثبت‌نام</a>
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
                <a className="landing-secondary-link" href="#pricing">دیدن پلن‌ها و قیمت‌ها <ChevronDown size={15} /></a>
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

        <section className="landing-section landing-pricing" id="pricing">
          <div className="landing-container">
            <div className="landing-pricing-header">
              <div className="landing-section-heading">
                <span className="landing-section-kicker">پلن‌های اشتراک · نمونه</span>
                <h2>پلنی برای <span>هر مرحلهٔ رشد</span></h2>
                <p>امکانات و قیمت‌ها فعلاً نمونه‌اند تا مسیر انتخاب و سفارش را ببینید.</p>
              </div>
              <div className="landing-billing-toggle" role="group" aria-label="دورهٔ پرداخت">
                <button type="button" aria-pressed={billingCycle === 'monthly'} className={billingCycle === 'monthly' ? 'is-selected' : ''} onClick={() => setBillingCycle('monthly')}>ماهانه</button>
                <button type="button" aria-pressed={billingCycle === 'annual'} className={billingCycle === 'annual' ? 'is-selected' : ''} onClick={() => setBillingCycle('annual')}>سالانه <span>۲ ماه رایگان</span></button>
              </div>
            </div>

            <div className="landing-pricing-grid">
              {pricingPlans.map((plan) => {
                const monthlyEquivalent = billingCycle === 'annual' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
                return (
                  <article className={`landing-plan-card ${plan.featured ? 'is-featured' : ''}`} key={plan.id}>
                    {plan.featured && <span className="landing-plan-popular"><Sparkles size={13} />محبوب‌ترین</span>}
                    <span className="landing-plan-kicker">کارو · پلن نمونه</span>
                    <h3>{plan.name}</h3>
                    <p className="landing-plan-tagline">{plan.tagline}</p>
                    <div className="landing-plan-price">
                      <strong>{formatToman(monthlyEquivalent)}</strong>
                      <span>تومان <small>/ ماه</small></span>
                    </div>
                    <p className="landing-plan-billing-note">
                      {billingCycle === 'annual'
                        ? `پرداخت سالانه ${formatToman(plan.annualPrice)} تومان · دو ماه رایگان`
                        : 'پرداخت ماهانه · قابل تغییر در هر زمان'}
                    </p>
                    <ul className="landing-plan-features">
                      {plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}
                    </ul>
                    <button className="landing-plan-button" type="button" aria-label={`انتخاب پلن ${plan.name}`} onClick={(event) => openPurchase(plan.id, event.currentTarget)}>
                      انتخاب پلن <ArrowLeft size={15} />
                    </button>
                  </article>
                );
              })}
            </div>

            <p className="landing-pricing-disclaimer" role="note"><CircleHelp size={16} /><span><strong>توجه:</strong> قیمت‌ها و امکانات صرفاً نمونه هستند. فرم ثبت‌نام و سفارش هم نمایشی است؛ اطلاعات ارسال یا ذخیره نمی‌شوند و پرداخت واقعی انجام نمی‌شود.</span></p>
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
            <div><span className="landing-final-icon"><Wallet size={21} /></span><h2>کارو را در عمل ببینید</h2><p>دموی تعاملی را بدون ثبت‌نام ببینید یا پلن‌های نمونه را بررسی کنید.</p></div>
            <nav className="landing-final-cta-actions" aria-label="گزینه‌های شروع">
              <button className="landing-primary-button landing-primary-light" type="button" onClick={openDemo}>رفتن به پیش‌نمایش <ArrowLeft size={17} /></button>
              <a className="landing-primary-button landing-primary-light" href="#pricing">پلن‌ها و قیمت‌ها <ArrowLeft size={17} /></a>
            </nav>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <a className="landing-brand" href="#top" aria-label="بازگشت به ابتدای صفحه" onClick={closeMobileMenu}>
            <img className="landing-brand-logo" src={`${import.meta.env.BASE_URL}karo-logo.png`} alt="" aria-hidden="true" />
          </a>
          <p>پیش‌نمایش کارو ۲.۰ · پلن‌ها و قیمت‌ها نمونه‌اند؛ ثبت‌نام و پرداخت واقعی فعال نیست.</p>
          <a className="landing-back-to-top" href="#top">ابتدای صفحه <ArrowLeft size={14} /></a>
        </div>
      </footer>
      {selectedPlan && <SubscriptionDialog key={selectedPlan.id} plan={selectedPlan} billingCycle={billingCycle} onClose={closePurchase} />}
    </div>
  );
}

function SubscriptionDialog({ plan, billingCycle, onClose }: { plan: PricingPlan; billingCycle: BillingCycle; onClose: () => void }) {
  const [step, setStep] = useState<PurchaseStep>('signup');
  const [signupDetails, setSignupDetails] = useState<SignupDetails | null>(null);
  const [formError, setFormError] = useState('');
  const dialogRef = useRef<HTMLElement>(null);
  const totalPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const billingLabel = billingCycle === 'annual' ? 'سالانه' : 'ماهانه';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const getFocusableElements = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    const stepFocusTarget = step === 'signup'
      ? dialog.querySelector<HTMLElement>('input[name="fullName"]')
      : step === 'review'
        ? dialog.querySelector<HTMLElement>('input[name="confirmDemo"]')
        : dialog.querySelector<HTMLElement>('.landing-subscription-complete .landing-plan-button');
    (stepFocusTarget ?? getFocusableElements()[0])?.focus();

    const keepFocusInsideDialog = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', keepFocusInsideDialog);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', keepFocusInsideDialog);
    };
  }, [onClose, step]);

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') ?? '');
    const passwordConfirmation = String(formData.get('passwordConfirmation') ?? '');
    if (password !== passwordConfirmation) {
      setFormError('گذرواژه‌های آزمایشی با هم یکسان نیستند.');
      return;
    }

    setFormError('');
    setSignupDetails({
      fullName: String(formData.get('fullName') ?? ''),
      businessName: String(formData.get('businessName') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      email: String(formData.get('email') ?? ''),
    });
    setStep('review');
  };

  const completeMockOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep('complete');
  };

  const stepLabel = step === 'signup' ? 'ثبت‌نام' : step === 'review' ? 'بررسی سفارش' : 'پایان';

  return (
    <div className="landing-subscription-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="landing-subscription-dialog" role="dialog" aria-modal="true" aria-labelledby="subscription-dialog-title" tabIndex={-1}>
        <button className="landing-subscription-close" type="button" aria-label="بستن ثبت‌نام و خرید" onClick={onClose}><X size={19} /></button>
        <span className="landing-section-kicker">ثبت‌نام و سفارش اشتراک · نمایشی</span>
        <h2 id="subscription-dialog-title">
          {step === 'signup' ? `ثبت‌نام برای پلن ${plan.name}` : step === 'review' ? 'بررسی سفارش اشتراک' : 'سفارش آزمایشی تکمیل شد'}
        </h2>
        <div className="landing-subscription-progress" aria-label={`مرحلهٔ ${step === 'signup' ? '۱' : step === 'review' ? '۲' : '۳'} از ۳ · ${stepLabel}`}>
          <span className={step === 'signup' ? 'is-active' : 'is-complete'}>۱ <small>ثبت‌نام</small></span>
          <i className={step === 'signup' ? '' : 'is-complete'} />
          <span className={step === 'review' ? 'is-active' : step === 'complete' ? 'is-complete' : ''}>۲ <small>بررسی سفارش</small></span>
          <i className={step === 'complete' ? 'is-complete' : ''} />
          <span className={step === 'complete' ? 'is-active' : ''}>۳ <small>پایان</small></span>
        </div>

        {step === 'signup' && (
          <form className="landing-subscription-form" onSubmit={handleSignup}>
            <div className="landing-subscription-notice" role="note"><CircleHelp size={16} /><span>این فرم فقط برای پیش‌نمایش است؛ از اطلاعات ساختگی استفاده کنید. چیزی ارسال یا ذخیره نمی‌شود.</span></div>
            <div className="landing-subscription-fields">
              <label className="landing-subscription-field"><span>نام و نام خانوادگی</span><input name="fullName" autoComplete="name" required minLength={2} defaultValue={signupDetails?.fullName ?? ''} placeholder="مثلاً سارا احمدی" /></label>
              <label className="landing-subscription-field"><span>نام کسب‌وکار</span><input name="businessName" required minLength={2} defaultValue={signupDetails?.businessName ?? ''} placeholder="مثلاً فروشگاه نمونه" /></label>
              <label className="landing-subscription-field"><span>شمارهٔ موبایل</span><input name="phone" type="tel" autoComplete="tel" required defaultValue={signupDetails?.phone ?? ''} placeholder="0912 000 0000" /></label>
              <label className="landing-subscription-field"><span>ایمیل</span><input name="email" type="email" autoComplete="email" required defaultValue={signupDetails?.email ?? ''} placeholder="name@example.test" /></label>
              <label className="landing-subscription-field"><span>گذرواژهٔ آزمایشی</span><input name="password" type="password" autoComplete="new-password" minLength={8} required placeholder="حداقل ۸ نویسه" /></label>
              <label className="landing-subscription-field"><span>تکرار گذرواژه</span><input name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} required placeholder="گذرواژه را دوباره وارد کنید" /></label>
            </div>
            {formError && <p className="landing-subscription-error" role="alert">{formError}</p>}
            <div className="landing-subscription-plan-summary"><span>پلن انتخاب‌شده</span><strong>{plan.name} · {billingLabel}</strong><b>{formatToman(totalPrice)} تومان</b></div>
            <div className="landing-subscription-actions">
              <button className="landing-plan-button" type="submit">ادامه به بررسی سفارش <ArrowLeft size={15} /></button>
              <button className="landing-subscription-text-button" type="button" onClick={onClose}>فعلاً نه</button>
            </div>
          </form>
        )}

        {step === 'review' && signupDetails && (
          <form className="landing-subscription-review" onSubmit={completeMockOrder}>
            <div className="landing-order-card">
              <div className="landing-order-row"><span>پلن</span><strong>{plan.name}</strong></div>
              <div className="landing-order-row"><span>دورهٔ اشتراک</span><strong>{billingLabel}</strong></div>
              <div className="landing-order-row"><span>نام نمایشی</span><strong>{signupDetails.fullName}</strong></div>
              <div className="landing-order-row"><span>نام کسب‌وکار</span><strong>{signupDetails.businessName}</strong></div>
              <div className="landing-order-row"><span>موبایل نمایشی</span><strong>{signupDetails.phone}</strong></div>
              <div className="landing-order-row"><span>ایمیل نمایشی</span><strong>{signupDetails.email}</strong></div>
              <div className="landing-order-total"><span>مبلغ نمونه</span><strong>{formatToman(totalPrice)} تومان</strong></div>
            </div>
            <div className="landing-subscription-notice" role="note"><CircleHelp size={16} /><span>درگاه پرداخت به این پیش‌نمایش وصل نیست؛ اشتراک فعال یا مبلغی کسر نمی‌شود.</span></div>
            <label className="landing-subscription-consent"><input type="checkbox" name="confirmDemo" required /><span>متوجه‌ام که این سفارش فقط شبیه‌سازی است و خرید واقعی انجام نمی‌شود.</span></label>
            <div className="landing-subscription-actions">
              <button className="landing-subscription-text-button" type="button" onClick={() => setStep('signup')}>ویرایش اطلاعات</button>
              <button className="landing-plan-button" type="submit">تکمیل سفارش نمایشی <ArrowLeft size={15} /></button>
            </div>
          </form>
        )}

        {step === 'complete' && (
          <div className="landing-subscription-complete">
            <span className="landing-subscription-success-icon"><Check size={27} /></span>
            <p>مسیر سفارش برای پلن <strong>{plan.name}</strong> با موفقیت نمایش داده شد.</p>
            <div className="landing-subscription-notice" role="note"><CircleHelp size={16} /><span>حساب کاربری یا اشتراک واقعی ایجاد نشد و هیچ اطلاعاتی ذخیره یا ارسال نشده است؛ پرداختی هم انجام نشده.</span></div>
            <button className="landing-plan-button" type="button" onClick={onClose}>بازگشت به پلن‌ها <ArrowLeft size={15} /></button>
          </div>
        )}
      </section>
    </div>
  );
}
