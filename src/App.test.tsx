import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

afterEach(() => cleanup());

describe('Hesabyar UI prototype', () => {
  it('shows the Persian dashboard and clearly marks its data as mock', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /صبح بخیر، سارا/ })).toBeTruthy();
    expect(screen.getByText('داده‌ها ساختگی‌اند و جایی ذخیره نمی‌شوند')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ثبت فروش' })).toBeTruthy();
  });

  it('updates the dashboard chart with static mock data for the selected period', () => {
    render(<App />);
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
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'مشتریان' }));

    expect(screen.getByRole('heading', { name: 'مشتریان', level: 1 })).toBeTruthy();
    expect(screen.getByText('آوید کریمی')).toBeTruthy();
  });

  it('opens a read-only detail preview for a sample customer', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'مشتریان' }));
    fireEvent.click(screen.getByRole('button', { name: 'نمایش جزئیات آوید کریمی' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'جزئیات مشتری نمونه' })).toBeTruthy();
    expect(within(dialog).getByText('آوید کریمی')).toBeTruthy();
    expect(within(dialog).getByText('۰۹۱۲ ۴۵۶ ۷۸۹۰')).toBeTruthy();
    expect(within(dialog).getByText('این اطلاعات ساختگی است و برای نمایش سابقهٔ واقعی یا محاسبهٔ مالی استفاده نمی‌شود.')).toBeTruthy();
  });

  it('filters the customer sample list by status and restores the full list', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'مشتریان' }));
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

  it('adds a sample customer in page memory without writing to browser storage', () => {
    window.localStorage.clear();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'مشتریان' }));
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
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'ثبت فروش' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'پیش‌نمایش ثبت فروش' })).toBeTruthy();
    expect(screen.getByText(/فروش واقعی ثبت نمی‌شود/)).toBeTruthy();
  });

  it('filters the sample invoice list from the global search', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'فروش و فاکتورها' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'جست‌وجو در داده‌های نمونه' }), { target: { value: 'آوید' } });

    expect(screen.getByText('فروشگاه آوید')).toBeTruthy();
    expect(screen.queryByText('مینا رضایی')).toBeNull();
  });

  it('opens the sample notifications panel', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'اعلان‌ها' }));

    expect(screen.getByText('۳ کالا رو به اتمام')).toBeTruthy();
  });
});
