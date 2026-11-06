import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

afterEach(() => cleanup());

function renderDashboard() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'دموی تعاملی' }));
}

function navigateViaMenu(groupLabel: string, itemLabel: string) {
  const sidebar = screen.getByRole('complementary', { name: 'منوی اصلی' });
  const collapsedToggle = within(sidebar).queryByRole('button', { name: `باز کردن زیرمنوی ${groupLabel}` });
  if (collapsedToggle) fireEvent.click(collapsedToggle);
  fireEvent.click(within(sidebar).getByRole('button', { name: itemLabel }));
}

describe('Karo UI prototype', () => {
  it('shows a Persian landing page and links to the sample dashboard', () => {
    render(<App />);

    const brandLink = screen.getByRole('link', { name: 'کارو، ابتدای صفحه' });
    expect(brandLink.querySelector('img')?.getAttribute('src')).toContain('karo-logo.png');
    expect(screen.getByRole('heading', { name: 'برای مدیریت کسب‌وکارت، یک نگاه روشن‌تر' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'چرا کارو؟' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'امکانات' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'پلن‌ها' }).getAttribute('href')).toBe('#pricing');
    expect(screen.getByRole('link', { name: 'ثبت‌نام' }).getAttribute('href')).toBe('#pricing');
    expect(screen.getByText('این نسخه فقط پیش‌نمایش رابط است؛ داده‌ها ساختگی‌اند و هیچ عملیات مالی یا ذخیره‌سازی انجام نمی‌شود.')).toBeTruthy();
    const firstFaq = screen.getByRole('button', { name: 'این نسخه به حساب واقعی من وصل می‌شود؟' });
    expect(firstFaq.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(firstFaq);
    expect(firstFaq.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'مشاهدهٔ پیش‌نمایش' }));
    expect(screen.getByRole('heading', { name: /صبح بخیر، سارا/ })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'کارو' })).toBeTruthy();
    expect(screen.getByText('کارو ۲.۰')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'بازگشت به صفحهٔ معرفی' }));
    expect(screen.getByRole('heading', { name: 'برای مدیریت کسب‌وکارت، یک نگاه روشن‌تر' })).toBeTruthy();
  });

  it('shows sample subscription pricing and walks through a non-persistent signup and mock order', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'پلنی برای هر مرحلهٔ رشد' })).toBeTruthy();
    expect(screen.getByText(/قیمت‌ها و امکانات صرفاً نمونه هستند/)).toBeTruthy();
    const annualBilling = screen.getByRole('button', { name: /سالانه/ });
    fireEvent.click(annualBilling);
    expect(annualBilling.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/پرداخت سالانه ۴٬۹۹۰٬۰۰۰ تومان · دو ماه رایگان/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'ماهانه' }));

    const chooseGrowthPlan = screen.getByRole('button', { name: 'انتخاب پلن رشد' });
    fireEvent.click(chooseGrowthPlan);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'ثبت‌نام برای پلن رشد' })).toBeTruthy();
    expect(document.activeElement).toBe(within(dialog).getByLabelText('نام و نام خانوادگی'));
    expect(within(dialog).getByText(/فقط برای پیش‌نمایش است/)).toBeTruthy();

    fireEvent.change(within(dialog).getByLabelText('نام و نام خانوادگی'), { target: { value: 'سارا احمدی' } });
    fireEvent.change(within(dialog).getByLabelText('نام کسب‌وکار'), { target: { value: 'فروشگاه نمونه' } });
    fireEvent.change(within(dialog).getByLabelText('شمارهٔ موبایل'), { target: { value: '09120000000' } });
    fireEvent.change(within(dialog).getByLabelText('ایمیل'), { target: { value: 'sara@example.test' } });
    fireEvent.change(within(dialog).getByLabelText('گذرواژهٔ آزمایشی'), { target: { value: 'samplepass' } });
    fireEvent.change(within(dialog).getByLabelText('تکرار گذرواژه'), { target: { value: 'different8' } });
    const signupForm = dialog.querySelector('form');
    expect(signupForm).not.toBeNull();
    fireEvent.submit(signupForm!);
    expect(within(dialog).getByRole('alert').textContent).toContain('یکسان نیستند');

    fireEvent.change(within(dialog).getByLabelText('تکرار گذرواژه'), { target: { value: 'samplepass' } });
    fireEvent.submit(signupForm!);
    expect(within(dialog).getByRole('heading', { name: 'بررسی سفارش اشتراک' })).toBeTruthy();
    expect(within(dialog).getByText('۴۹۹٬۰۰۰ تومان')).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('checkbox'));
    fireEvent.click(within(dialog).getByRole('button', { name: 'تکمیل سفارش نمایشی' }));

    expect(within(dialog).getByRole('heading', { name: 'سفارش آزمایشی تکمیل شد' })).toBeTruthy();
    expect(within(dialog).getByText(/حساب کاربری یا اشتراک واقعی ایجاد نشد/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: 'بازگشت به پلن‌ها' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(chooseGrowthPlan);

    fireEvent.click(chooseGrowthPlan);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(chooseGrowthPlan);
  });

  it('shows the Persian dashboard and clearly marks its data as mock', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: /صبح بخیر، سارا/ })).toBeTruthy();
    expect(screen.getByText('داده‌ها ساختگی‌اند و جایی ذخیره نمی‌شوند')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ثبت فروش' })).toBeTruthy();
  });

  it('updates the dashboard chart with static mock data for the selected period', () => {
    renderDashboard();
    expect(screen.getByRole('img', { name: 'نمودار نمونهٔ فروش و دریافت برای این هفته؛ داده‌ها ساختگی‌اند' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'این هفته' }));
    fireEvent.click(screen.getByRole('button', { name: 'امروز' }));
    expect(screen.getByRole('img', { name: 'نمودار نمونهٔ فروش و دریافت برای امروز؛ داده‌ها ساختگی‌اند' })).toBeTruthy();
    expect(screen.getByText('نمایش ساعتی نمونه')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'امروز' }));
    fireEvent.click(screen.getByRole('button', { name: 'این فصل' }));
    expect(screen.getByRole('img', { name: 'نمودار نمونهٔ فروش و دریافت برای این فصل؛ داده‌ها ساختگی‌اند' })).toBeTruthy();
    expect(screen.getByText('نمایش ماهانه نمونه')).toBeTruthy();
  });

  it('navigates to the customers sample view', () => {
    renderDashboard();

    navigateViaMenu('سایر', 'اشخاص');

    expect(screen.getByRole('heading', { name: 'مشتریان', level: 1 })).toBeTruthy();
    expect(screen.getByText('آوید کریمی')).toBeTruthy();
  });

  it('announces the mobile navigation, moves focus inside, and traps focus until Escape', () => {
    renderDashboard();
    const menuToggle = screen.getByRole('button', { name: 'باز کردن منو' });
    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(menuToggle);

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(menuToggle.getAttribute('aria-controls')).toBe('main-sidebar');
    const sidebar = screen.getByRole('complementary', { name: 'منوی اصلی' });
    const activePageButton = within(sidebar).getByRole('button', { name: 'نمای کلی' });
    expect(activePageButton.getAttribute('aria-current')).toBe('page');
    expect(document.activeElement).toBe(activePageButton);

    const sidebarButtons = within(sidebar).getAllByRole('button');
    const firstButton = sidebarButtons[0];
    const lastButton = sidebarButtons[sidebarButtons.length - 1];
    firstButton.focus();
    fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastButton);
    fireEvent.keyDown(lastButton, { key: 'Tab' });
    expect(document.activeElement).toBe(firstButton);

    fireEvent.keyDown(firstButton, { key: 'Escape' });
    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menuToggle);
  });

  it('expands nested menu sections and changes the sample fiscal year', () => {
    renderDashboard();
    const sidebar = screen.getByRole('complementary', { name: 'منوی اصلی' });
    const checksToggle = within(sidebar).getByRole('button', { name: 'باز کردن زیرمنوی چک' });

    expect(checksToggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(checksToggle);
    expect(within(sidebar).getByRole('button', { name: 'بستن زیرمنوی چک' }).getAttribute('aria-expanded')).toBe('true');
    expect(within(sidebar).getByRole('button', { name: 'چک‌های دریافتی' })).toBeTruthy();
    fireEvent.click(within(sidebar).getByRole('button', { name: 'چک‌های دریافتی' }));
    expect(screen.getByRole('heading', { name: 'این قابلیت در حال طراحی است' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'بستن' }));
    fireEvent.click(within(sidebar).getByRole('button', { name: 'بستن زیرمنوی چک' }));
    expect(within(sidebar).queryByRole('button', { name: 'چک‌های دریافتی' })).toBeNull();

    fireEvent.click(within(sidebar).getByRole('button', { name: /انتخاب سال مالی/ }));
    const yearMenu = within(sidebar).getByRole('group', { name: 'انتخاب سال مالی' });
    fireEvent.click(within(yearMenu).getByRole('button', { name: 'سال مالی ۱۴۰۴' }));
    expect(within(sidebar).getByRole('button', { name: 'انتخاب سال مالی؛ سال مالی ۱۴۰۴' })).toBeTruthy();
  });

  it('opens a read-only invoice preview without offering payment or edit actions', () => {
    renderDashboard();
    navigateViaMenu('فاکتورها و تراکنش‌ها', 'فروش و فاکتورها');
    fireEvent.click(screen.getByRole('button', { name: 'نمایش جزئیات فروشگاه آوید' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'جزئیات فاکتور نمونه' })).toBeTruthy();
    expect(within(dialog).getByText('فروشگاه آوید')).toBeTruthy();
    expect(within(dialog).getByText('امروز، ۱۰:۴۲')).toBeTruthy();
    expect(within(dialog).getByText('۳ قلم')).toBeTruthy();
    expect(within(dialog).getByText('۱۲,۴۸۰,۰۰۰ تومان')).toBeTruthy();
    expect(within(dialog).getByText('اقلام نمونه · تعداد نمایشی')).toBeTruthy();
    expect(within(dialog).getByText('قهوهٔ اسپرسو ۲۵۰ گرمی')).toBeTruthy();
    expect(within(dialog).getByText(/مبلغ از اقلام محاسبه نمی‌شود/)).toBeTruthy();
    expect(within(dialog).queryByRole('button', { name: /تسویه|ویرایش|حذف/ })).toBeNull();
  });

  it('opens a read-only activity detail preview without transaction actions', () => {
    renderDashboard();
    navigateViaMenu('فاکتورها و تراکنش‌ها', 'دریافت و پرداخت');
    fireEvent.click(screen.getByRole('button', { name: 'نمایش جزئیات واریز مشتری' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'جزئیات گردش نمونه' })).toBeTruthy();
    expect(within(dialog).getByText('واریز مشتری', { selector: 'strong' })).toBeTruthy();
    expect(within(dialog).getByText('مینا رضایی')).toBeTruthy();
    expect(within(dialog).getByText('دریافت فروش')).toBeTruthy();
    expect(within(dialog).getByText('امروز، ۱۰:۲۵')).toBeTruthy();
    expect(within(dialog).getByText('+۸,۷۵۰,۰۰۰ تومان')).toBeTruthy();
    expect(within(dialog).getByText('این اطلاعات ساختگی و ثابت‌اند؛ هیچ دریافت یا پرداخت واقعی ثبت نمی‌شود و مانده‌ای تغییر نمی‌کند.')).toBeTruthy();
    expect(within(dialog).queryByRole('button', { name: /ثبت|پرداخت|ویرایش|حذف/ })).toBeNull();
  });

  it('opens a read-only detail preview for a sample customer', () => {
    renderDashboard();
    navigateViaMenu('سایر', 'اشخاص');
    fireEvent.click(screen.getByRole('button', { name: 'نمایش جزئیات آوید کریمی' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'جزئیات مشتری نمونه' })).toBeTruthy();
    expect(within(dialog).getByText('آوید کریمی')).toBeTruthy();
    expect(within(dialog).getByText('۰۹۱۲ ۴۵۶ ۷۸۹۰')).toBeTruthy();
    expect(within(dialog).getByText('این اطلاعات ساختگی است و برای نمایش سابقهٔ واقعی یا محاسبهٔ مالی استفاده نمی‌شود.')).toBeTruthy();
  });

  it('opens read-only sample inventory details from the inventory list', () => {
    renderDashboard();
    navigateViaMenu('انبارداری', 'کالا و انبار');
    fireEvent.click(screen.getByRole('button', { name: 'نمایش جزئیات قهوهٔ اسپرسو ۲۵۰ گرمی' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'جزئیات کالای نمونه' })).toBeTruthy();
    expect(within(dialog).getByText('قهوهٔ اسپرسو ۲۵۰ گرمی')).toBeTruthy();
    expect(within(dialog).getByText('SKU-1024')).toBeTruthy();
    expect(within(dialog).getByText('۸۴ عدد')).toBeTruthy();
    expect(within(dialog).getByText('۴۸۵,۰۰۰ تومان')).toBeTruthy();
    expect(within(dialog).getByText('این مشخصات ساختگی‌اند؛ قیمت یا موجودی تغییر نمی‌کند و هیچ سفارش، خرید یا فروشی ثبت نمی‌شود.')).toBeTruthy();
    expect(within(dialog).queryByRole('button', { name: /ویرایش|حذف|خرید|فروش|ثبت/ })).toBeNull();
  });

  it('opens the sample item detail directly from the low-stock dashboard list', () => {
    renderDashboard();
    fireEvent.click(screen.getByRole('button', { name: 'نمایش چای ممتاز بهاره' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'جزئیات کالای نمونه' })).toBeTruthy();
    expect(within(dialog).getByText('چای ممتاز بهاره')).toBeTruthy();
    expect(within(dialog).getByText('SKU-1088')).toBeTruthy();
    expect(within(dialog).getByText('۷ عدد')).toBeTruthy();
  });

  it('filters the customer sample list by status and restores the full list', () => {
    renderDashboard();
    navigateViaMenu('سایر', 'اشخاص');
    fireEvent.click(screen.getByRole('button', { name: 'فیلتر مشتریان: همهٔ مشتریان' }));

    const filterMenu = screen.getByRole('group', { name: 'فیلتر مشتریان بر اساس وضعیت' });
    fireEvent.click(within(filterMenu).getByRole('button', { name: 'فعال' }));
    expect(screen.getByText('آوید کریمی')).toBeTruthy();
    expect(screen.getByText('کافه رُستا')).toBeTruthy();
    expect(screen.queryByText('مینا رضایی')).toBeNull();
    expect(screen.getByText('نمایش ۲ مورد نمونه')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'فیلتر مشتریان: فعال' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر مشتریان بر اساس وضعیت' })).getByRole('button', { name: 'همهٔ مشتریان' }));
    expect(screen.getByText('مینا رضایی')).toBeTruthy();
  });

  it('resets a mock status filter when switching between record pages', () => {
    renderDashboard();
    navigateViaMenu('سایر', 'اشخاص');
    fireEvent.click(screen.getByRole('button', { name: 'فیلتر مشتریان: همهٔ مشتریان' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر مشتریان بر اساس وضعیت' })).getByRole('button', { name: 'فعال' }));
    expect(screen.getByRole('button', { name: 'فیلتر مشتریان: فعال' })).toBeTruthy();

    navigateViaMenu('فاکتورها و تراکنش‌ها', 'دریافت و پرداخت');
    expect(screen.getByRole('button', { name: 'فیلتر گردش‌ها: همهٔ گردش‌ها' })).toBeTruthy();

    navigateViaMenu('سایر', 'اشخاص');
    expect(screen.getByRole('button', { name: 'فیلتر مشتریان: همهٔ مشتریان' })).toBeTruthy();
  });

  it('filters sample invoices by payment status and restores the full list', () => {
    renderDashboard();
    navigateViaMenu('فاکتورها و تراکنش‌ها', 'فروش و فاکتورها');
    fireEvent.click(screen.getByRole('button', { name: 'فیلتر فاکتورها: همهٔ فاکتورها' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر فاکتورها بر اساس وضعیت' })).getByRole('button', { name: 'در انتظار پرداخت' }));

    expect(screen.getByText('مینا رضایی')).toBeTruthy();
    expect(screen.queryByText('فروشگاه آوید')).toBeNull();
    expect(screen.getByText('نمایش ۱ مورد نمونه')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'فیلتر فاکتورها: در انتظار پرداخت' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر فاکتورها بر اساس وضعیت' })).getByRole('button', { name: 'همهٔ فاکتورها' }));
    expect(screen.getByText('فروشگاه آوید')).toBeTruthy();
  });

  it('filters sample activity by direction and restores the full list', () => {
    renderDashboard();
    navigateViaMenu('فاکتورها و تراکنش‌ها', 'دریافت و پرداخت');
    fireEvent.click(screen.getByRole('button', { name: 'فیلتر گردش‌ها: همهٔ گردش‌ها' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر گردش‌ها بر اساس وضعیت' })).getByRole('button', { name: 'پرداخت‌ها' }));

    expect(screen.getByText('خرید ملزومات')).toBeTruthy();
    expect(screen.getByText('پرداخت قبض')).toBeTruthy();
    expect(screen.queryByText('واریز مشتری')).toBeNull();
    expect(screen.getByText('نمایش ۲ مورد نمونه')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'فیلتر گردش‌ها: پرداخت‌ها' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر گردش‌ها بر اساس وضعیت' })).getByRole('button', { name: 'همهٔ گردش‌ها' }));
    expect(screen.getByText('واریز مشتری')).toBeTruthy();
  });

  it('filters sample inventory by stock status and restores the full list', () => {
    renderDashboard();
    navigateViaMenu('انبارداری', 'کالا و انبار');
    fireEvent.click(screen.getByRole('button', { name: 'فیلتر کالاها: همهٔ کالاها' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر کالاها بر اساس وضعیت' })).getByRole('button', { name: 'رو به اتمام' }));

    expect(screen.getByText('چای ممتاز بهاره')).toBeTruthy();
    expect(screen.getByText('دانهٔ قهوهٔ عربیکا')).toBeTruthy();
    expect(screen.getByText('شکلات تلخ ۷۰٪')).toBeTruthy();
    expect(screen.queryByText('لیوان سرامیکی سفید')).toBeNull();
    expect(screen.getByText('نمایش ۳ مورد نمونه')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'فیلتر کالاها: رو به اتمام' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر کالاها بر اساس وضعیت' })).getByRole('button', { name: 'همهٔ کالاها' }));
    expect(screen.getByText('لیوان سرامیکی سفید')).toBeTruthy();
    expect(screen.getByText('نمایش ۵ مورد نمونه')).toBeTruthy();
  });

  it('adds a sample customer in page memory without writing to browser storage', () => {
    window.localStorage.clear();
    renderDashboard();
    navigateViaMenu('سایر', 'اشخاص');
    fireEvent.click(screen.getByRole('button', { name: 'مشتری جدید' }));
    fireEvent.change(screen.getByLabelText('نام نمونه'), { target: { value: 'نگار آزمایشی' } });
    fireEvent.change(screen.getByLabelText('شمارهٔ نمایشی (اختیاری)'), { target: { value: '۰۹۱۲ ۰۰۰ ۰۰۰۰' } });
    fireEvent.click(screen.getByRole('button', { name: 'افزودن نمونه' }));

    expect(screen.getByText('نگار آزمایشی')).toBeTruthy();
    expect(screen.getByText('مشتری نمونه · حافظهٔ موقت همین صفحه')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'نمایش جزئیات نگار آزمایشی' }));
    expect(within(screen.getByRole('dialog')).getByText('نگار آزمایشی')).toBeTruthy();
    expect(window.localStorage.length).toBe(0);

    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'فیلتر مشتریان: همهٔ مشتریان' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'فیلتر مشتریان بر اساس وضعیت' })).getByRole('button', { name: 'نمونه‌های موقت' }));
    expect(screen.getByText('نگار آزمایشی')).toBeTruthy();
    expect(screen.queryByText('آوید کریمی')).toBeNull();
    expect(screen.getByText('نمایش ۱ مورد نمونه')).toBeTruthy();
  });

  it('opens a non-persistent sale preview instead of recording a transaction', () => {
    renderDashboard();

    fireEvent.click(screen.getByRole('button', { name: 'ثبت فروش' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'پیش‌نمایش ثبت فروش' })).toBeTruthy();
    expect(screen.getByText(/فروش واقعی ثبت نمی‌شود/)).toBeTruthy();
  });

  it('keeps keyboard focus inside a preview dialog and restores it after closing', () => {
    renderDashboard();
    const trigger = screen.getByRole('button', { name: 'ثبت فروش' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog');
    const dialogButtons = within(dialog).getAllByRole('button');
    const firstButton = dialogButtons[0];
    const lastButton = dialogButtons[dialogButtons.length - 1];
    expect(document.activeElement).toBe(firstButton);
    fireEvent.keyDown(firstButton, { key: '/' });
    expect(document.activeElement).toBe(firstButton);

    fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastButton);
    fireEvent.keyDown(lastButton, { key: 'Tab' });
    expect(document.activeElement).toBe(firstButton);

    fireEvent.click(firstButton);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('filters the sample invoice list from the global search', () => {
    renderDashboard();
    navigateViaMenu('فاکتورها و تراکنش‌ها', 'فروش و فاکتورها');
    fireEvent.change(screen.getByRole('searchbox', { name: 'جست‌وجو در داده‌های نمونه' }), { target: { value: 'آوید' } });

    expect(screen.getByText('فروشگاه آوید')).toBeTruthy();
    expect(screen.queryByText('مینا رضایی')).toBeNull();
  });

  it('opens the sample notifications panel', () => {
    renderDashboard();

    fireEvent.click(screen.getByRole('button', { name: 'اعلان‌ها' }));

    expect(screen.getByText('۳ کالا رو به اتمام')).toBeTruthy();
  });
});
