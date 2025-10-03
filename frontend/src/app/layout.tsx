// app/layout.tsx or app/layout.jsx
"use client";

import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import AuthProvider from "@/components/AuthProvider";
import SonnerWrapper from "@/components/helpers/SonnerWrapper";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children} <SonnerWrapper />
        </Provider>
      </body>
    </html>
  );
}
