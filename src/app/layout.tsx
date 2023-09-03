"use client";
import '../../public/cosmo.css';
import '../../public/pkgdown.css';
import '../../public/globals.css';
import "@fontsource/fira-code";
import { Navbar } from './Navbar';
import Footer from './Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{paddingTop: "60px"}}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}