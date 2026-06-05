import React from "react";
import { Logo } from "./logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white text-center border-2 border-primary/20 rounded-xl dark:text-white  text-stone-700 dark:bg-black">
      {/* <!--Copyright section--> */}
      <div className="container h-40 items-center  flex flex-col justify-center">
        <Link href="/" className="flex items-center justify-center gap-1">
          <Logo className="h-20 w-20" fill="fill-primary" />
          <div className="text-primary text-3xl font-bold">CineScope.lk</div>
        </Link>
        <div>
          <nav className="ml-auto flex items-center justify-center mt-5 gap-7 text-stone-700 dark:text-white">
            <Link
              href="/movies"
              className="hover:text-primary text-sm font-medium transition-colors">
              Movies
            </Link>
            <Link
              href="/genres"
              className="hover:text-primary text-sm font-medium transition-colors">
              Genres
            </Link>
            <Link
              href="/about"
              className="hover:text-primary text-sm font-medium transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
      <div className="border-t-2 border-primary/20" />
      <div className="container dark:text-white flex h-35  items-center justify-between dark:bg-black">
        <div className="text-stone-700 dark:text-white text-sm">
          © 2025 CineScope. All rights reserved.
        </div>
        <div className="text-stone-700 dark:text-white gap-7">
          <Link href="/terms" className="text-sm hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="ml-4 text-sm hover:underline">
            Privacy
          </Link>
          <Link href="/cookies" className="ml-4 text-sm hover:underline">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
