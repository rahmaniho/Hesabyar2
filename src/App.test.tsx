import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => cleanup());

describe('Hesabyar UI prototype', () => {
  it('shows the Persian dashboard and clearly marks its data as mock', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /صبح بخیر، سارا/ })).toBeTruthy();
    expect(screen.getByText('داده‌ها ساختگی‌اند و جایی ذخیره نمی‌شوند')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ثبت فروش' })).toBeTruthy();
  });

  it('navigates to the customers sample view', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'مشتریان' }));

    expect(screen.getByRole('heading', { name: 'مشتریان', level: 1 })).toBeTruthy();
    expect(screen.getByText('آوید کریمی')).toBeTruthy();
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
