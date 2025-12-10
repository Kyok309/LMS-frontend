import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const montserrat = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "LMS",
  description: "Сургалтын менежментийн систем",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" richColors/>
      </body>
    </html>
  );
}
