'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { QueryProvider } from './components/providers/query-provider';
import Navbar from './components/ui/navbar';
import { Provider } from 'react-redux';
import { store } from './store/store';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <Provider store={store}>
            <Navbar title='Journey Builder' />
            {children}
          </Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
