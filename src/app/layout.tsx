import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ArtlyPet - Transform Photos Into Masterpieces',
  description:
    'Transform your pet photos, portraits, or creative mixes into stunning AI-powered artistic masterpieces. Choose from Renaissance, Watercolor, Pop Art, and more.',
  keywords: [
    'AI pet portrait',
    'pet art',
    'AI portrait generator',
    'pet painting',
    'dog portrait',
    'cat portrait',
    'Renaissance pet',
    'watercolor pet',
    'AI art generator',
  ],
  openGraph: {
    title: 'ArtlyPet - Transform Photos Into Masterpieces',
    description:
      'Turn your pets and portraits into stunning AI-powered art. 12+ artistic styles, museum-quality results.',
    siteName: 'ArtlyPet',
    type: 'website',
    url: 'https://artlypet.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtlyPet - Transform Photos Into Masterpieces',
    description:
      'Turn your pets and portraits into stunning AI-powered art.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-black text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
