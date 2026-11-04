import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Activity,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PageId = 'overview' | 'sales' | 'activity' | 'customers' | 'inventory' | 'reports' | 'settings';
type ModalKind = 'sale' | 'customer' | 'customer-detail' | 'help' | 'report' | 'generic' | null;
type StatusTone = 'success' | 'warning' | 'muted' | 'danger' | 'info';

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface DataRow {
  id: string;
  initials: string;
  primary: string;
  secondary: string;
  values: string[];
  status: string;
  tone: StatusTone;
  avatarTone?: number;
}

interface RecordConfig {
  title: string;
  subtitle: string;
  action: string;
  actionKind: Exclude<ModalKind, 'help' | 'report' | null>;
  columns: string[];
  stats: { label: string; value: string; icon: LucideIcon; tone: string; footnote: string }[];
  rows: DataRow[];
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'نمای کلی', icon: LayoutDashboard },
  { id: 'sales', label: 'فروش و فاکتورها', icon: Receipt },
  { id: 'activity', label: 'دریافت و پرداخت', icon: CreditCard },
  { id: 'customers', label: 'مشتریان', icon: Users },
  { id: 'inventory', label: 'کالا و انبار', icon: Boxes },
  { id: 'reports', label: 'گزارش‌ها', icon: BarChart3 },
];

const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  overview: { title: 'نمای کلی', subtitle: 'نمایی از اتفاق‌های امروز کسب‌وکار شما' },
  sales: { title: 'فروش و فاکتورها', subtitle: 'فاکتورها و سفارش‌های نمونهٔ فروشگاه' },
  activity: { title: 'دریافت و پرداخت', subtitle: 'گردش‌های نمایشی صندوق و حساب‌ها' },
  customers: { title: 'مشتریان', subtitle: 'دفتر مشتریان نمونه و خلاصهٔ ارتباط‌ها' },
  inventory: { title: 'کالا و انبار', subtitle: 'نمایی نمونه از کالاها و وضعیت موجودی' },
  reports: { title: 'گزارش‌ها', subtitle: 'گزارش‌های نمایشی برای مرور روندها' },
  settings: { title: 'تنظیمات', subtitle: 'تنظیمات نمایشی محیط پیش‌نمایش' },
};

const invoiceRows: DataRow[] = [
  { id: '2481', initials: 'آ', primary: 'فروشگاه آوید', secondary: 'فاکتور شمارهٔ ۲۴۸۱', values: ['امروز، ۱۰:۴۲', '۳ قلم', '۱۲,۴۸۰,۰۰۰ تومان'], status: 'تسویه‌شده', tone: 'success', avatarTone: 1 },
  { id: '2480', initials: 'م', primary: 'مینا رضایی', secondary: 'فاکتور شمارهٔ ۲۴۸۰', values: ['امروز، ۱۰:۱۸', '۲ قلم', '۸,۷۵۰,۰۰۰ تومان'], status: 'در انتظار', tone: 'warning', avatarTone: 2 },
  { id: '2479', initials: 'ک', primary: 'کافه رُستا', secondary: 'فاکتور شمارهٔ ۲۴۷۹', values: ['امروز، ۰۹:۵۶', '۵ قلم', '۲۱,۳۲۰,۰۰۰ تومان'], status: 'تسویه‌شده', tone: 'success', avatarTone: 3 },
  { id: '2478', initials: 'ن', primary: 'نوید محمدی', secondary: 'فاکتور شمارهٔ ۲۴۷۸', values: ['دیروز، ۱۸:۲۰', '۱ قلم', '۳,۹۰۰,۰۰۰ تومان'], status: 'پیش‌نویس', tone: 'muted', avatarTone: 4 },
];

const recordConfigs: Record<'sales' | 'activity' | 'customers' | 'inventory', RecordConfig> = {
  sales: {
    title: 'فروش و فاکتورها',
    subtitle: 'فهرست فاکتورهای نمونه؛ اطلاعات این صفحه ذخیره نمی‌شوند.',
    action: 'فاکتور جدید',
    actionKind: 'sale',
    columns: ['زمان ثبت', 'اقلام', 'مبلغ'],
    stats: [
      { label: 'فاکتورهای امروز', value: '۳۲', icon: Receipt, tone: 'mint', footnote: 'دادهٔ نمونه' },
      { label: 'فروش امروز', value: '۱۲,۸۴۰,۰۰۰', icon: Wallet, tone: 'blue', footnote: 'تومان · نمایشی' },
      { label: 'در انتظار پرداخت', value: '۴', icon: Clock3, tone: 'amber', footnote: 'فاکتور نمونه' },
    ],
    rows: invoiceRows,
  },
  activity: {
    title: 'دریافت و پرداخت',
    subtitle: 'گردش‌های مالی ساختگی برای نمایش چیدمان صفحه.',
    action: 'ثبت گردش',
    actionKind: 'generic',
    columns: ['دسته‌بندی', 'تاریخ', 'مبلغ'],
    stats: [
      { label: 'دریافت امروز', value: '۸,۴۲۰,۰۰۰', icon: ArrowDownLeft, tone: 'mint', footnote: 'تومان · نمایشی' },
      { label: 'پرداخت امروز', value: '۲,۱۱۰,۰۰۰', icon: ArrowUpRight, tone: 'rose', footnote: 'تومان · نمایشی' },
      { label: 'ماندهٔ نمایشی', value: '۲۴,۶۵۰,۰۰۰', icon: Wallet, tone: 'blue', footnote: 'تومان · نمونه' },
    ],
    rows: [
      { id: '1', initials: 'و', primary: 'واریز مشتری', secondary: 'مینا رضایی', values: ['دریافت فروش', 'امروز، ۱۰:۲۵', '+۸,۷۵۰,۰۰۰ تومان'], status: 'دریافت', tone: 'success', avatarTone: 1 },
      { id: '2', initials: 'خ', primary: 'خرید ملزومات', secondary: 'فروشگاه مرکزی', values: ['هزینهٔ جاری', 'امروز، ۰۹:۱۲', '−۱,۴۵۰,۰۰۰ تومان'], status: 'پرداخت', tone: 'warning', avatarTone: 2 },
      { id: '3', initials: 'آ', primary: 'دریافت نقدی', secondary: 'فروش حضوری', values: ['صندوق فروش', 'دیروز، ۱۸:۴۰', '+۳,۹۰۰,۰۰۰ تومان'], status: 'دریافت', tone: 'success', avatarTone: 3 },
      { id: '4', initials: 'ب', primary: 'پرداخت قبض', secondary: 'هزینهٔ آب و برق', values: ['هزینهٔ جاری', 'دیروز، ۱۶:۰۵', '−۶۶۰,۰۰۰ تومان'], status: 'پرداخت', tone: 'warning', avatarTone: 4 },
    ],
  },
  customers: {
    title: 'مشتریان',
    subtitle: 'دفتر مشتریان نمونه برای مرور چیدمان و جست‌وجو.',
    action: 'مشتری جدید',
    actionKind: 'customer',
    columns: ['شماره تماس', 'آخرین خرید', 'ماندهٔ نمونه'],
    stats: [
      { label: 'مشتریان', value: '۲۴۸', icon: Users, tone: 'blue', footnote: 'در دادهٔ نمایشی' },
      { label: 'مشتری فعال', value: '۱۸۶', icon: Activity, tone: 'mint', footnote: 'در ۳۰ روز اخیر' },
      { label: 'ماندهٔ باز', value: '۲۴,۶۵۰,۰۰۰', icon: Wallet, tone: 'amber', footnote: 'تومان · نمونه' },
    ],
    rows: [
      { id: '1', initials: 'آ', primary: 'آوید کریمی', secondary: 'مشتری از مهر ۱۴۰۴', values: ['۰۹۱۲ ۴۵۶ ۷۸۹۰', 'امروز، ۱۰:۴۲', '۰ تومان'], status: 'فعال', tone: 'success', avatarTone: 1 },
      { id: '2', initials: 'م', primary: 'مینا رضایی', secondary: 'مشتری از آذر ۱۴۰۳', values: ['۰۹۱۰ ۲۳۴ ۵۶۷۸', 'امروز، ۱۰:۱۸', '۸,۷۵۰,۰۰۰ تومان'], status: 'مانده دارد', tone: 'warning', avatarTone: 2 },
      { id: '3', initials: 'ک', primary: 'کافه رُستا', secondary: 'مشتری از خرداد ۱۴۰۵', values: ['۰۲۱ ۸۸۴۴ ۳۲۱۰', 'امروز، ۰۹:۵۶', '۰ تومان'], status: 'فعال', tone: 'success', avatarTone: 3 },
      { id: '4', initials: 'ن', primary: 'نوید محمدی', secondary: 'مشتری از شهریور ۱۴۰۵', values: ['۰۹۳۵ ۷۸۹ ۰۱۲۳', 'دیروز، ۱۸:۲۰', '۳,۹۰۰,۰۰۰ تومان'], status: 'مانده دارد', tone: 'warning', avatarTone: 4 },
    ],
  },
  inventory: {
    title: 'کالا و انبار',
    subtitle: 'کالاها و موجودی ساختگی؛ هیچ تغییری در انبار ثبت نمی‌شود.',
    action: 'افزودن کالا',
    actionKind: 'generic',
    columns: ['شناسه', 'دسته‌بندی', 'موجودی', 'قیمت نمونه'],
    stats: [
      { label: 'کل کالاها', value: '۱,۲۸۶', icon: Package, tone: 'blue', footnote: 'در فهرست نمایشی' },
      { label: 'موجودی کم', value: '۱۲', icon: Boxes, tone: 'amber', footnote: 'نیازمند بازبینی' },
      { label: 'ارزش نمونه', value: '۴۸۲,۳۰۰,۰۰۰', icon: Wallet, tone: 'mint', footnote: 'تومان · محاسبه نشده' },
    ],
    rows: [
      { id: '1', initials: 'ق', primary: 'قهوهٔ اسپرسو ۲۵۰ گرمی', secondary: 'محصول پر‌فروش', values: ['SKU-1024', 'نوشیدنی', '۸۴ عدد', '۴۸۵,۰۰۰ تومان'], status: 'موجود', tone: 'success', avatarTone: 1 },
      { id: '2', initials: 'چ', primary: 'چای ممتاز بهاره', secondary: 'محصول بسته‌بندی', values: ['SKU-1088', 'نوشیدنی', '۷ عدد', '۳۲۰,۰۰۰ تومان'], status: 'رو به اتمام', tone: 'warning', avatarTone: 2 },
      { id: '3', initials: 'ل', primary: 'لیوان سرامیکی سفید', secondary: 'لوازم جانبی', values: ['SKU-1201', 'لوازم جانبی', '۴۲ عدد', '۲۸۰,۰۰۰ تومان'], status: 'موجود', tone: 'success', avatarTone: 3 },
      { id: '4', initials: 'د', primary: 'دانهٔ قهوهٔ عربیکا', secondary: 'محصول پر‌فروش', values: ['SKU-1340', 'نوشیدنی', '۳ عدد', '۶۸۰,۰۰۰ تومان'], status: 'رو به اتمام', tone: 'warning', avatarTone: 4 },
    ],
  },
};

const activityItems = [
  { title: 'فروش حضوری', caption: 'فاکتور #۲۴۸۱ · فروشگاه آوید', time: '۱۰:۴۲', amount: '+۱۲,۴۸۰,۰۰۰', tone: 'income' },
  { title: 'دریافت از مشتری', caption: 'مینا رضایی · کارت‌خوان', time: '۱۰:۱۸', amount: '+۸,۷۵۰,۰۰۰', tone: 'income' },
  { title: 'خرید ملزومات', caption: 'فروشگاه مرکزی · هزینهٔ جاری', time: '۰۹:۱۲', amount: '−۱,۴۵۰,۰۰۰', tone: 'expense' },
];

const chartData = [
  { label: 'ش', sales: 49, received: 30 },
  { label: 'ی', sales: 70, received: 44 },
  { label: 'د', sales: 56, received: 36 },
  { label: 'س', sales: 82, received: 57 },
  { label: 'چ', sales: 61, received: 38 },
  { label: 'پ', sales: 91, received: 68 },
  { label: 'ج', sales: 73, received: 48 },
];

const lowStockItems = [
  { name: 'چای ممتاز بهاره', category: 'نوشیدنی', quantity: '۷ عدد', tone: 'amber' },
  { name: 'دانهٔ قهوهٔ عربیکا', category: 'نوشیدنی', quantity: '۳ عدد', tone: 'rose' },
  { name: 'شکلات تلخ ۷۰٪', category: 'تنقلات', quantity: '۹ عدد', tone: 'amber' },
];

function getPersianDate() {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    timeZone: 'Asia/Tehran',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [prototypeCustomers, setPrototypeCustomers] = useState<DataRow[]>(recordConfigs.customers.rows);
  const [selectedCustomer, setSelectedCustomer] = useState<DataRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('این هفته');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);
  const searchInput = useRef<HTMLInputElement>(null);

  const page = pageMeta[activePage];
  const isRecordsPage = activePage === 'sales' || activePage === 'activity' || activePage === 'customers' || activePage === 'inventory';

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2800);
  };

  const navigate = (pageId: PageId) => {
    setActivePage(pageId);
    setSidebarOpen(false);
    setNotificationsOpen(false);
    setRangeOpen(false);
  };

  const closeModal = () => {
    setModalKind(null);
    setSelectedCustomer(null);
  };

  const openCustomerDetails = (customer: DataRow) => {
    setSelectedCustomer(customer);
    setModalKind('customer-detail');
    setNotificationsOpen(false);
    setRangeOpen(false);
  };

  const addPrototypeCustomer = (name: string, phone: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) return;

    setPrototypeCustomers((customers) => [{
      id: `demo-${Date.now()}`,
      initials: normalizedName.slice(0, 1),
      primary: normalizedName,
      secondary: 'مشتری نمونه · حافظهٔ موقت همین صفحه',
      values: [phone.trim() || 'ثبت نشده', 'همین حالا', '۰ تومان'],
      status: 'نمونه',
      tone: 'info',
      avatarTone: 1,
    }, ...customers]);
    setActivePage('customers');
    setSearchQuery('');
    closeModal();
    showToast('رکورد نمونه فقط تا تازه‌سازی صفحه در حافظه می‌ماند.');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target && ['INPUT', 'TEXTAREA'].includes(target.tagName);
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === 'Escape') {
        setModalKind(null);
        setSelectedCustomer(null);
        setSidebarOpen(false);
        setNotificationsOpen(false);
        setRangeOpen(false);
        setSearchFocused(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  const handlePrimaryAction = (kind: ModalKind) => {
    setSelectedCustomer(null);
    setModalKind(kind);
    setNotificationsOpen(false);
    setRangeOpen(false);
  };

  return (
    <div className="app-shell" dir="rtl">
      <div className={`mobile-scrim ${sidebarOpen ? 'is-visible' : ''}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      <Sidebar
        activePage={activePage}
        open={sidebarOpen}
        onNavigate={navigate}
        onHelp={() => handlePrimaryAction('help')}
      />

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-start">
            <button className="icon-button mobile-menu" type="button" aria-label="باز کردن منو" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <span>حساب‌یار</span>
              <ChevronLeft size={14} />
              <strong>{page.title}</strong>
            </div>
          </div>

          <div className="topbar-tools">
            <div className={`global-search ${searchFocused ? 'is-focused' : ''}`}>
              <Search size={17} aria-hidden="true" />
              <input
                ref={searchInput}
                id="global-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
                placeholder="جست‌وجو در این صفحه..."
                aria-label="جست‌وجو در داده‌های نمونه"
              />
              {!searchQuery && <kbd>/</kbd>}
              {searchQuery && (
                <button type="button" className="search-clear" aria-label="پاک کردن جست‌وجو" onMouseDown={(event) => event.preventDefault()} onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="toolbar-divider" />
            <div className="range-control">
              <button className={`range-button ${rangeOpen ? 'is-open' : ''}`} type="button" onClick={() => setRangeOpen((value) => !value)} aria-expanded={rangeOpen}>
                <CalendarDays size={17} />
                <span>{selectedRange}</span>
                <ChevronDown size={14} />
              </button>
              {rangeOpen && (
                <div className="floating-menu range-menu">
                  {['امروز', 'این هفته', 'این ماه', 'این فصل'].map((range) => (
                    <button key={range} type="button" className={selectedRange === range ? 'selected' : ''} onClick={() => { setSelectedRange(range); setRangeOpen(false); }}>
                      <span>{range}</span>
                      {selectedRange === range && <Check size={15} />}
                    </button>
                  ))}
                  <p>بازه‌ها فقط برای نمایش رابط هستند.</p>
                </div>
              )}
            </div>

            <div className="notification-control">
              <button className={`icon-button notification-button ${notificationsOpen ? 'is-active' : ''}`} type="button" aria-label="اعلان‌ها" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setRangeOpen(false); }}>
                <Bell size={19} />
                <span className="notification-dot" />
              </button>
              {notificationsOpen && <NotificationsPanel />}
            </div>

            <button className="profile-chip" type="button" onClick={() => showToast('حساب کاربری در این پیش‌نمایش متصل نیست.')}>
              <span className="profile-avatar">س</span>
              <span className="profile-text"><strong>سارا احمدی</strong><small>مدیر فروشگاه</small></span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        <main className="page-content">
          <div className="prototype-banner">
            <span className="prototype-dot" />
            <span>پیش‌نمایش رابط</span>
            <span className="banner-separator">·</span>
            <span>داده‌ها ساختگی‌اند و جایی ذخیره نمی‌شوند</span>
            <button type="button" onClick={() => handlePrimaryAction('help')} aria-label="دربارهٔ پیش‌نمایش">
              <CircleHelp size={15} />
              <span>درباره</span>
            </button>
          </div>

          {activePage === 'overview' && <Dashboard onAction={handlePrimaryAction} onNavigate={navigate} query={searchQuery} selectedRange={selectedRange} />}
          {isRecordsPage && <RecordsPage pageId={activePage as keyof typeof recordConfigs} query={searchQuery} onAction={handlePrimaryAction} rowsOverride={activePage === 'customers' ? prototypeCustomers : undefined} onCustomerSelect={activePage === 'customers' ? openCustomerDetails : undefined} />}
          {activePage === 'reports' && <ReportsPage onAction={handlePrimaryAction} selectedRange={selectedRange} />}
          {activePage === 'settings' && <SettingsPage onAction={handlePrimaryAction} showToast={showToast} />}

          <footer className="app-footer">
            <span>حساب‌یار ۲.۰</span>
            <span>پروتوتایپ رابط · بدون ذخیره‌سازی یا عملیات مالی</span>
            <span>{getPersianDate()}</span>
          </footer>
        </main>
      </div>

      {modalKind && <PreviewModal kind={modalKind} onClose={closeModal} onNavigate={navigate} onCreateCustomer={addPrototypeCustomer} selectedCustomer={selectedCustomer} />}
      {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    </div>
  );
}

function Sidebar({ activePage, open, onNavigate, onHelp }: { activePage: PageId; open: boolean; onNavigate: (id: PageId) => void; onHelp: () => void }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="منوی اصلی">
      <div className="brand-row">
        <div className="brand-mark"><Wallet size={22} strokeWidth={2.2} /></div>
        <div className="brand-copy"><strong>حساب‌یار</strong><span>مدیریت مالی ساده‌تر</span></div>
        <span className="brand-version">۲.۰</span>
      </div>

      <div className="workspace-switcher">
        <span className="workspace-avatar">ن</span>
        <span className="workspace-label"><strong>فروشگاه نارون</strong><small>فضای کاری نمونه</small></span>
        <ChevronDown size={15} />
      </div>

      <div className="sidebar-section-label">فضای کاری</div>
      <nav className="primary-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" className={`nav-item ${activePage === item.id ? 'is-active' : ''}`} onClick={() => onNavigate(item.id)}>
              <Icon size={19} strokeWidth={activePage === item.id ? 2.15 : 1.85} />
              <span>{item.label}</span>
              {item.id === 'activity' && <span className="nav-count">۳</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-section-label sidebar-lower-label">مدیریت</div>
      <nav className="primary-nav secondary-nav">
        <button type="button" className={`nav-item ${activePage === 'settings' ? 'is-active' : ''}`} onClick={() => onNavigate('settings')}>
          <Settings size={19} /><span>تنظیمات</span>
        </button>
        <button type="button" className="nav-item muted-nav-item" onClick={onHelp}>
          <CircleHelp size={19} /><span>راهنما و بازخورد</span>
        </button>
      </nav>

      <div className="sidebar-spacer" />
      <div className="sidebar-plan-card">
        <div className="plan-icon"><Sparkles size={17} /></div>
        <div><strong>محیط پیش‌نمایش</strong><span>اطلاعات نمونه، بدون ثبت</span></div>
        <span className="plan-status" aria-label="نسخهٔ آزمایشی" />
        <button type="button" className="plan-link" onClick={onHelp}>دربارهٔ این نسخه <ArrowLeft size={14} /></button>
      </div>
      <div className="sidebar-user">
        <span className="profile-avatar">س</span>
        <span><strong>سارا احمدی</strong><small>مدیر فروشگاه</small></span>
        <button type="button" aria-label="بستن راهنما" onClick={onHelp}><MoreHorizontal size={19} /></button>
      </div>
    </aside>
  );
}

function Dashboard({ onAction, onNavigate, query, selectedRange }: { onAction: (kind: ModalKind) => void; onNavigate: (id: PageId) => void; query: string; selectedRange: string }) {
  const stats = [
    { label: 'فروش امروز', value: '۱۲,۸۴۰,۰۰۰', unit: 'تومان', change: '۱۲.۸٪', caption: 'نسبت به روز قبل', trend: 'up', icon: Wallet, tone: 'mint' },
    { label: 'دریافت‌های امروز', value: '۸,۴۲۰,۰۰۰', unit: 'تومان', change: '۶.۴٪', caption: 'نسبت به روز قبل', trend: 'up', icon: ArrowDownLeft, tone: 'blue' },
    { label: 'ماندهٔ مشتریان', value: '۲۴,۶۵۰,۰۰۰', unit: 'تومان', change: '۲.۱٪', caption: 'کاهش نسبت به هفتهٔ قبل', trend: 'down', icon: Users, tone: 'amber' },
    { label: 'فاکتورهای امروز', value: '۳۲', unit: 'فاکتور', change: '۸.۲٪', caption: 'نسبت به روز قبل', trend: 'up', icon: Receipt, tone: 'purple' },
  ] as const;

  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> پنج‌شنبهٔ پربرکت</div>
          <h1>صبح بخیر، سارا <span className="wave">✦</span></h1>
          <p>این نمای کلی، خلاصه‌ای از داده‌های نمونهٔ فروشگاه شماست.</p>
        </div>
        <div className="welcome-actions">
          <div className="today-label"><CalendarDays size={16} /><span>{getPersianDate()}</span></div>
          <button className="button button-secondary" type="button" onClick={() => onNavigate('reports')}><BarChart3 size={17} />گزارش‌ها</button>
          <button className="button button-primary" type="button" onClick={() => onAction('sale')}><Plus size={18} />ثبت فروش</button>
        </div>
      </section>

      <section className="stats-grid" aria-label="خلاصهٔ شاخص‌ها">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <div className="dashboard-grid dashboard-grid-top">
        <ChartPanel selectedRange={selectedRange} />
        <section className="card day-summary-card">
          <div className="card-heading">
            <div><span className="section-kicker">یک نگاه سریع</span><h2>خلاصهٔ امروز</h2></div>
            <button type="button" className="quiet-icon-button" aria-label="گزینه‌های خلاصه" onClick={() => onAction('help')}><MoreHorizontal size={20} /></button>
          </div>
          <div className="summary-total">
            <span>مجموع فروش نمونه</span>
            <strong>۱۲,۸۴۰,۰۰۰ <small>تومان</small></strong>
            <div className="summary-progress"><span /></div>
            <div className="summary-goal"><span>هدف نمایشی روزانه</span><strong>۷۶٪</strong></div>
          </div>
          <div className="summary-breakdown">
            <div><span className="breakdown-dot dot-teal" /><span>فروش حضوری</span><strong>۸,۵۲۰,۰۰۰</strong></div>
            <div><span className="breakdown-dot dot-blue" /><span>فروش اعتباری</span><strong>۴,۳۲۰,۰۰۰</strong></div>
          </div>
          <div className="summary-footnote"><span className="tiny-check"><Check size={12} /></span>اطلاعات این کارت فقط برای نمایش رابط است.</div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <section className="card recent-card">
          <div className="card-heading">
            <div><span className="section-kicker">آخرین رویدادها</span><h2>فاکتورهای اخیر</h2></div>
            <button type="button" className="text-link" onClick={() => onNavigate('sales')}>مشاهدهٔ همه <ChevronLeft size={15} /></button>
          </div>
          <DataTable rows={invoiceRows} columns={['زمان ثبت', 'اقلام', 'مبلغ']} query={query} compact />
          <div className="table-card-footer"><span><span className="small-dot" /> داده‌های فاکتور نمایشی‌اند</span><button type="button" onClick={() => onNavigate('sales')}>فهرست فاکتورها <ArrowLeft size={14} /></button></div>
        </section>

        <section className="card activity-card">
          <div className="card-heading">
            <div><span className="section-kicker">در جریان</span><h2>فعالیت‌های اخیر</h2></div>
            <button type="button" className="quiet-icon-button" aria-label="مشاهدهٔ دریافت و پرداخت" onClick={() => onNavigate('activity')}><MoreHorizontal size={20} /></button>
          </div>
          <div className="activity-list">
            {activityItems.map((item, index) => (
              <div className="activity-item" key={item.title}>
                <div className={`activity-icon activity-${item.tone}`}>{item.tone === 'income' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</div>
                <div className="activity-copy"><strong>{item.title}</strong><span>{item.caption}</span></div>
                <div className="activity-side"><strong className={item.tone === 'income' ? 'text-positive' : 'text-negative'}>{item.amount}</strong><small>{item.time}</small></div>
                {index < activityItems.length - 1 && <span className="activity-line" />}
              </div>
            ))}
          </div>
          <button className="activity-more" type="button" onClick={() => onNavigate('activity')}>همهٔ گردش‌ها <ArrowLeft size={14} /></button>
        </section>
      </div>

      <div className="dashboard-grid dashboard-grid-stock">
        <section className="card stock-card">
          <div className="card-heading">
            <div><span className="section-kicker">نیازمند توجه</span><h2>موجودی رو به اتمام</h2></div>
            <button type="button" className="text-link" onClick={() => onNavigate('inventory')}>همهٔ کالاها <ChevronLeft size={15} /></button>
          </div>
          <div className="stock-list">
            {lowStockItems.map((item) => (
              <div className="stock-row" key={item.name}>
                <div className="stock-product-icon"><Package size={18} /></div>
                <div className="stock-product-copy"><strong>{item.name}</strong><small>{item.category}</small></div>
                <span className={`stock-quantity stock-${item.tone}`}>{item.quantity}</span>
                <button type="button" className="row-action" aria-label={`نمایش ${item.name}`} onClick={() => onNavigate('inventory')}><ChevronLeft size={16} /></button>
              </div>
            ))}
          </div>
        </section>
        <section className="focus-card">
          <div className="focus-decoration focus-decoration-one" />
          <div className="focus-decoration focus-decoration-two" />
          <span className="focus-icon"><Sparkles size={19} /></span>
          <span className="focus-label">یک پیشنهاد کوچک</span>
          <h2>روزت رو با یک نگاه<br />به گزارش‌ها جمع‌بندی کن.</h2>
          <p>روند فروش و وضعیت نمونه را در یک صفحه ببین.</p>
          <button type="button" onClick={() => onNavigate('reports')}>رفتن به گزارش‌ها <ArrowLeft size={15} /></button>
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value, unit, change, caption, trend, icon: Icon, tone }: {
  label: string; value: string; unit: string; change: string; caption: string; trend: 'up' | 'down'; icon: LucideIcon; tone: string;
}) {
  return (
    <article className="stat-card">
      <div className="stat-topline"><span>{label}</span><span className={`stat-icon stat-icon-${tone}`}><Icon size={19} strokeWidth={1.9} /></span></div>
      <div className="stat-value"><strong>{value}</strong><span>{unit}</span></div>
      <div className="stat-footline">
        <span className={`stat-change ${trend === 'up' ? 'is-up' : 'is-down'}`}>{trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{change}</span>
        <span className="stat-caption">{caption}</span>
      </div>
      <span className={`stat-accent accent-${tone}`} />
    </article>
  );
}

function ChartPanel({ selectedRange }: { selectedRange: string }) {
  return (
    <section className="card chart-card">
      <div className="card-heading chart-heading">
        <div><span className="section-kicker">روند کسب‌وکار</span><h2>فروش و دریافت</h2></div>
        <button type="button" className="chart-period" aria-label={`بازهٔ انتخاب‌شده ${selectedRange}`}><span className="chart-period-dot" />{selectedRange}<ChevronDown size={14} /></button>
      </div>
      <div className="chart-legend">
        <span><i className="legend-sales" />فروش</span>
        <span><i className="legend-received" />دریافت</span>
        <strong>مبالغ و روندها ساختگی‌اند</strong>
      </div>
      <div className="bar-chart" role="img" aria-label="نمودار نمونهٔ فروش و دریافت در هفت روز هفته">
        <div className="chart-y-labels"><span>۲۰ میلیون</span><span>۱۵ میلیون</span><span>۱۰ میلیون</span><span>۵ میلیون</span><span>۰</span></div>
        <div className="chart-plot">
          <div className="chart-gridlines"><i /><i /><i /><i /><i /></div>
          <div className="chart-columns">
            {chartData.map((day, index) => (
              <div className={`chart-day ${index === 5 ? 'is-current' : ''}`} key={`${day.label}-${index}`}>
                <div className="bar-pair">
                  <span className="bar bar-sales" style={{ height: `${day.sales}%` }} />
                  <span className="bar bar-received" style={{ height: `${day.received}%` }} />
                </div>
                <span className="chart-day-label">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-bottom"><span><span className="chart-foot-dot" /> نمایش هفتگی نمونه</span><span>واحد مبالغ: تومان · نمایشی</span></div>
    </section>
  );
}

function DataTable({ rows, columns, query, compact = false, onRowSelect }: { rows: DataRow[]; columns: string[]; query: string; compact?: boolean; onRowSelect?: (row: DataRow) => void }) {
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fa-IR');
    if (!normalized) return rows;
    return rows.filter((row) => [row.primary, row.secondary, row.status, ...row.values].join(' ').toLocaleLowerCase('fa-IR').includes(normalized));
  }, [query, rows]);

  if (filteredRows.length === 0) {
    return <div className="empty-search"><Search size={18} /><span>نتیجه‌ای برای «{query}» پیدا نشد.</span></div>;
  }

  return (
    <div className={`table-scroll ${compact ? 'is-compact' : ''}`}>
      <table className="data-table">
        <thead><tr><th scope="col">عنوان</th>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}<th scope="col">وضعیت</th>{onRowSelect && <th scope="col">جزئیات</th>}</tr></thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="table-primary-cell">
                  <span className={`table-avatar tone-${row.avatarTone ?? 1}`}>{row.initials}</span>
                  <span className="table-primary-copy"><strong>{row.primary}</strong><small>{row.secondary}</small></span>
                </div>
              </td>
              {row.values.map((value, index) => <td key={`${row.id}-${index}`} className={value.includes('تومان') && (value.startsWith('+') || value.startsWith('−')) ? 'amount-cell' : ''}>{value}</td>)}
              <td><span className={`status-pill status-${row.tone}`}><span />{row.status}</span></td>
              {onRowSelect && <td><button type="button" className="row-action" aria-label={`نمایش جزئیات ${row.primary}`} onClick={() => onRowSelect(row)}><ChevronLeft size={16} /></button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordsPage({ pageId, query, onAction, rowsOverride, onCustomerSelect }: { pageId: keyof typeof recordConfigs; query: string; onAction: (kind: ModalKind) => void; rowsOverride?: DataRow[]; onCustomerSelect?: (row: DataRow) => void }) {
  const config = recordConfigs[pageId];
  const rows = rowsOverride ?? config.rows;
  const Icon = pageId === 'sales' ? Receipt : pageId === 'activity' ? CreditCard : pageId === 'customers' ? Users : Package;

  return (
    <section className="workspace-page">
      <div className="page-heading-row">
        <div><div className="page-icon-heading"><span className="page-heading-icon"><Icon size={21} /></span><div><span className="section-kicker">فضای کاری نمونه</span><h1>{config.title}</h1></div></div><p>{config.subtitle}</p></div>
        <button type="button" className="button button-primary" onClick={() => onAction(config.actionKind)}><Plus size={17} />{config.action}</button>
      </div>

      <div className="stats-grid page-stats-grid">
        {config.stats.map((stat) => <MiniStat key={stat.label} {...stat} />)}
      </div>

      <section className="card records-card">
        <div className="card-heading records-heading">
          <div><span className="section-kicker">فهرست نمونه</span><h2>{config.title}</h2></div>
          <div className="records-toolbar">
            <button type="button" className="button button-light" onClick={() => onAction('generic')}><Filter size={16} />فیلتر</button>
            <button type="button" className="button button-light" onClick={() => onAction('generic')}><Download size={16} />خروجی</button>
            <button type="button" className="quiet-icon-button" aria-label="گزینه‌های فهرست" onClick={() => onAction('help')}><MoreHorizontal size={19} /></button>
          </div>
        </div>
        <div className="records-hint"><span className="small-dot" />جست‌وجوی بالای صفحه روی فهرست نمونه اعمال می‌شود.</div>
        <DataTable rows={rows} columns={config.columns} query={query} onRowSelect={pageId === 'customers' ? onCustomerSelect : undefined} />
        <div className="records-footer"><span>نمایش {rows.length} مورد نمونه</span><div className="pagination"><button type="button" disabled aria-label="صفحهٔ قبل"><ChevronLeft size={16} /></button><span className="page-number is-current">۱</span><span className="page-number">۲</span><span className="page-number">۳</span><button type="button" aria-label="صفحهٔ بعد" onClick={() => onAction('generic')}><ChevronLeft size={16} /></button></div></div>
      </section>

      <div className="prototype-note"><Sparkles size={17} /><span>{pageId === 'customers' ? 'افزودن مشتری فقط یک رکورد نمونه در حافظهٔ موقت صفحه می‌سازد؛ با تازه‌سازی پاک می‌شود.' : 'این صفحه فقط رابط را نمایش می‌دهد؛ ساخت و ویرایش رکوردها هنوز فعال نیست.'}</span></div>
    </section>
  );
}

function MiniStat({ label, value, icon: Icon, tone, footnote }: { label: string; value: string; icon: LucideIcon; tone: string; footnote: string }) {
  return (
    <article className="mini-stat-card">
      <span className={`stat-icon stat-icon-${tone}`}><Icon size={18} /></span>
      <div><span>{label}</span><strong>{value}</strong><small>{footnote}</small></div>
    </article>
  );
}

function ReportsPage({ onAction, selectedRange }: { onAction: (kind: ModalKind) => void; selectedRange: string }) {
  return (
    <section className="workspace-page">
      <div className="page-heading-row">
        <div><div className="page-icon-heading"><span className="page-heading-icon"><BarChart3 size={21} /></span><div><span className="section-kicker">بینش‌های نمایشی</span><h1>گزارش‌ها</h1></div></div><p>نمونه‌ای از نمای گزارش؛ هیچ عددی از دادهٔ واقعی به‌دست نیامده است.</p></div>
        <button type="button" className="button button-secondary" onClick={() => onAction('report')}><Download size={17} />دریافت گزارش</button>
      </div>
      <div className="stats-grid page-stats-grid report-stats-grid">
        <MiniStat label="فروش دوره" value="۸۶,۴۲۰,۰۰۰" icon={Wallet} tone="mint" footnote="تومان · نمونه" />
        <MiniStat label="تعداد فاکتور" value="۱۸۴" icon={Receipt} tone="blue" footnote="در بازهٔ نمایشی" />
        <MiniStat label="میانگین فروش" value="۴۷۰,۷۶۰" icon={Activity} tone="purple" footnote="تومان · نمایشی" />
      </div>
      <ChartPanel selectedRange={selectedRange} />
      <div className="report-lower-grid">
        <section className="card insight-card">
          <div className="card-heading"><div><span className="section-kicker">ترکیب فروش</span><h2>فروش بر اساس دسته</h2></div><button type="button" className="quiet-icon-button" aria-label="گزینه‌ها" onClick={() => onAction('help')}><MoreHorizontal size={19} /></button></div>
          <div className="category-list">
            {[
              { name: 'نوشیدنی', value: '۴۲,۸۰۰,۰۰۰', percent: '۴۸٪', width: '48%', tone: 'teal' },
              { name: 'لوازم جانبی', value: '۲۴,۳۰۰,۰۰۰', percent: '۲۷٪', width: '27%', tone: 'blue' },
              { name: 'تنقلات', value: '۱۴,۷۰۰,۰۰۰', percent: '۱۶٪', width: '16%', tone: 'amber' },
              { name: 'سایر', value: '۴,۶۲۰,۰۰۰', percent: '۹٪', width: '9%', tone: 'purple' },
            ].map((item) => <div className="category-row" key={item.name}><div className="category-top"><span><i className={`category-dot ${item.tone}`} />{item.name}</span><strong>{item.value} <small>تومان</small></strong></div><div className="category-track"><span className={`category-fill ${item.tone}`} style={{ width: item.width }} /></div><div className="category-foot"><span>سهم از فروش نمونه</span><strong>{item.percent}</strong></div></div>)}
          </div>
        </section>
        <section className="card insight-note-card"><span className="insight-note-icon"><Sparkles size={19} /></span><span className="section-kicker">یادآوری</span><h2>اعداد این صفحه فقط برای پیش‌نمایش طراحی هستند.</h2><p>گزارش‌های واقعی پس از تعیین قواعد مالی و منبع داده ساخته خواهند شد.</p><button type="button" className="text-link" onClick={() => onAction('help')}>دربارهٔ پیش‌نمایش <ArrowLeft size={14} /></button></section>
      </div>
    </section>
  );
}

function SettingsPage({ onAction, showToast }: { onAction: (kind: ModalKind) => void; showToast: (message: string) => void }) {
  const settingGroups = [
    { icon: Users, title: 'حساب و فضای کاری', description: 'نام فروشگاه، اطلاعات تماس و کاربران', badge: 'پیشنهادی' },
    { icon: Wallet, title: 'واحد پول و مالیات', description: 'قواعد پولی و تنظیمات محاسبات', badge: 'نیازمند تصمیم' },
    { icon: Bell, title: 'اعلان‌ها', description: 'یادآوری موجودی و رویدادهای روزانه', badge: 'نمونه' },
    { icon: FileText, title: 'پشتیبان‌گیری و داده', description: 'خروجی، بازیابی و نگهداری داده‌ها', badge: 'در طراحی' },
  ];
  return (
    <section className="workspace-page">
      <div className="page-heading-row">
        <div><div className="page-icon-heading"><span className="page-heading-icon"><Settings size={21} /></span><div><span className="section-kicker">شخصی‌سازی</span><h1>تنظیمات</h1></div></div><p>گزینه‌ها برای نمایش چیدمان رابط هستند و چیزی را تغییر نمی‌دهند.</p></div>
        <span className="settings-prototype-badge"><span className="prototype-dot" />فقط پیش‌نمایش</span>
      </div>
      <section className="settings-grid">
        {settingGroups.map((group) => { const Icon = group.icon; return <button className="card setting-card" type="button" key={group.title} onClick={() => showToast('تنظیمات در نسخهٔ نمایشی ذخیره یا تغییر نمی‌شوند.')}><span className="setting-icon"><Icon size={20} /></span><span className="setting-copy"><strong>{group.title}</strong><small>{group.description}</small><em>{group.badge}</em></span><ChevronLeft size={18} className="setting-arrow" /></button>; })}
      </section>
      <section className="card workspace-profile-card"><div className="workspace-profile-logo">ن</div><div><span className="section-kicker">فضای کاری نمایشی</span><h2>فروشگاه نارون</h2><p>اطلاعات واقعی فروشگاه در این نمونه وارد نشده است.</p></div><button type="button" className="button button-light" onClick={() => onAction('help')}>دربارهٔ نمونه <CircleHelp size={16} /></button></section>
    </section>
  );
}

function NotificationsPanel() {
  return (
    <div className="floating-menu notifications-menu">
      <div className="popover-heading"><strong>اعلان‌ها</strong><span>۲ مورد جدید</span></div>
      <div className="notification-item"><span className="notification-icon notif-amber"><Package size={17} /></span><div><strong>۳ کالا رو به اتمام</strong><small>برای مشاهدهٔ نمونه، وارد کالا و انبار شوید.</small><time>حدود ۲۰ دقیقه پیش</time></div></div>
      <div className="notification-item"><span className="notification-icon notif-blue"><Receipt size={17} /></span><div><strong>فاکتور در انتظار پرداخت</strong><small>یک فاکتور نمونه نیازمند پیگیری است.</small><time>حدود ۱ ساعت پیش</time></div></div>
      <div className="popover-footnote">اعلان‌ها نیز بخشی از دادهٔ نمایشی هستند.</div>
    </div>
  );
}

function PreviewModal({ kind, onClose, onNavigate, onCreateCustomer, selectedCustomer }: { kind: ModalKind; onClose: () => void; onNavigate: (page: PageId) => void; onCreateCustomer: (name: string, phone: string) => void; selectedCustomer: DataRow | null }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const handleCustomerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (customerName.trim()) onCreateCustomer(customerName, customerPhone);
  };
  const content = kind === 'sale'
    ? { icon: ShoppingCart, title: 'پیش‌نمایش ثبت فروش', label: 'فروش واقعی ثبت نمی‌شود', description: 'این نسخه فقط رابط را نشان می‌دهد. ثبت فروش، محاسبهٔ مبلغ، پرداخت و موجودی تا تصویب قواعد مالی و پیاده‌سازی امن غیرفعال است.' }
    : kind === 'customer'
      ? { icon: Users, title: 'مشتری نمونه جدید', label: 'افزودن موقت به پیش‌نمایش', description: 'این فرم فقط یک رکورد ساختگی را در حافظهٔ موقت صفحه اضافه می‌کند؛ لطفاً اطلاعات واقعی مشتری وارد نکنید.' }
      : kind === 'customer-detail'
        ? { icon: Users, title: 'جزئیات مشتری نمونه', label: 'اطلاعات نمایشی و موقت', description: 'این نمای ساختگی فقط برای مرور چیدمان است و هیچ پرونده یا سابقهٔ واقعی مشتری را نمایش نمی‌دهد.' }
      : kind === 'report'
        ? { icon: FileText, title: 'خروجی گزارش', label: 'در این نسخه آماده نیست', description: 'گزارش‌ها نمونه هستند و هیچ فایل یا خروجی واقعی تولید نمی‌شود.' }
        : kind === 'help'
          ? { icon: CircleHelp, title: 'دربارهٔ این پیش‌نمایش', label: 'نمونهٔ رابط Hesabyar 2.0', description: 'اطلاعات صفحه ساختگی است. این نسخه به API یا پایگاه داده وصل نیست و هیچ عملیات مالی، مجوز نرم‌افزار یا تنظیمات واقعی را اجرا نمی‌کند.' }
          : { icon: Sparkles, title: 'این قابلیت در حال طراحی است', label: 'نمونهٔ تعاملی', description: 'این دکمه برای نمایش مسیر رابط اضافه شده است. قابلیت‌های داده‌ای در این پیش‌نمایش غیرفعال‌اند.' };
  const Icon = content.icon;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="modal-close" aria-label="بستن" onClick={onClose}><X size={19} /></button>
        <span className="modal-symbol"><Icon size={23} /></span>
        <span className="section-kicker">{content.label}</span>
        <h2 id="modal-title">{content.title}</h2>
        <p>{content.description}</p>
        {kind === 'sale' && (
          <div className="sale-preview-fields">
            <div className="preview-field"><span>مشتری</span><strong>انتخاب مشتری نمونه</strong><ChevronDown size={15} /></div>
            <div className="preview-field"><span>کالا</span><strong>جست‌وجوی کالای نمونه</strong><Search size={15} /></div>
            <div className="preview-total"><span>جمع نمونه</span><strong>۱۲,۴۸۰,۰۰۰ تومان</strong></div>
          </div>
        )}
        {kind === 'customer-detail' && selectedCustomer && (
          <div className="customer-detail-card">
            <div className="customer-detail-heading">
              <span className={`table-avatar tone-${selectedCustomer.avatarTone ?? 1}`}>{selectedCustomer.initials}</span>
              <div className="customer-detail-copy"><strong>{selectedCustomer.primary}</strong><small>{selectedCustomer.secondary}</small></div>
              <span className={`status-pill status-${selectedCustomer.tone}`}><span />{selectedCustomer.status}</span>
            </div>
            <dl className="customer-detail-list">
              <div><dt>شمارهٔ نمایشی</dt><dd>{selectedCustomer.values[0] || 'ثبت نشده'}</dd></div>
              <div><dt>آخرین خرید نمونه</dt><dd>{selectedCustomer.values[1] || 'ثبت نشده'}</dd></div>
              <div><dt>ماندهٔ نمایشی</dt><dd>{selectedCustomer.values[2] || 'ثبت نشده'}</dd></div>
            </dl>
            <p className="customer-detail-note">این اطلاعات ساختگی است و برای نمایش سابقهٔ واقعی یا محاسبهٔ مالی استفاده نمی‌شود.</p>
          </div>
        )}
        {kind === 'customer' ? (
          <form className="customer-preview-form" onSubmit={handleCustomerSubmit}>
            <label className="modal-input-label" htmlFor="prototype-customer-name">نام نمونه</label>
            <input id="prototype-customer-name" type="text" autoComplete="off" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="مثلاً نگار آزمایشی" required />
            <label className="modal-input-label" htmlFor="prototype-customer-phone">شمارهٔ نمایشی (اختیاری)</label>
            <input id="prototype-customer-phone" type="tel" autoComplete="off" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="مثلاً ۰۹۱۲ ۰۰۰ ۰۰۰۰" />
            <div className="customer-memory-warning"><span className="small-dot" />از اطلاعات واقعی مشتری استفاده نکنید؛ رکورد فقط تا تازه‌سازی در حافظهٔ صفحه می‌ماند.</div>
            <div className="modal-actions">
              <button type="submit" className="button button-primary" disabled={!customerName.trim()}>افزودن نمونه</button>
              <button type="button" className="button button-secondary" onClick={onClose}>انصراف</button>
            </div>
          </form>
        ) : (
          <div className="modal-actions">
            <button type="button" className="button button-primary" onClick={onClose}>{kind === 'customer-detail' ? 'بستن' : 'متوجه شدم'}</button>
            {kind === 'sale' && <button type="button" className="button button-secondary" onClick={() => { onClose(); onNavigate('sales'); }}>دیدن فاکتورهای نمونه</button>}
          </div>
        )}
        <div className="modal-safety"><span className="small-dot" />بدون ذخیره‌سازی پایدار · بدون اتصال به دادهٔ واقعی</div>
      </section>
    </div>
  );
}
