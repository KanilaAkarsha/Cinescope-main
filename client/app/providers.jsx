"use client";

import { Provider } from "react-redux";
import { store } from "@/app/app/store";
import AuthInitializer from "@/components/auth-initializer";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
      <Toaster position="top-center" />
    </Provider>
  );
}
