import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "antd";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "web3 god",
  description: "search address, contract and hash tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token，影响范围大
              colorPrimary: "#0c0",
              borderRadius: 4,
              // 派生变量，影响范围小
              colorBgContainer: "#f6ffed",
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
