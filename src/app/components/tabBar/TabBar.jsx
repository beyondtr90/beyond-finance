"use client"
import React from "react";
import TabBarStyle from "./TabBar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

function TabBar() {
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Anasayfa", icon: "https://img.icons8.com/ios/50/home.png", alt: "Home Icon" },
    { href: "/stock", label: "Yatırım", icon: "https://img.icons8.com/ios/50/combo-chart--v1.png", alt: "Investment Icon" },
    { href: "/wallet", label: "Cüzdan", icon: "https://img.icons8.com/ios/50/wallet--v1.png", alt: "Wallet Icon" },
    { href: "/profile", label: "Profil", icon: "https://img.icons8.com/parakeet-line/48/user.png", alt: "User Icon" },
  ];

  return (
    <nav className={TabBarStyle.nav}>
      <ul className={TabBarStyle.icons}>
        {links.map(({ href, icon, alt }) => (
          <li key={href}>
            <Link href={href}>
              <img
                width="50"
                height="50"
                src={icon}
                alt={alt}
              />
            </Link>
          </li>
        ))}
      </ul>
      <ul className={TabBarStyle.iconLabel}>
        {links.map(({ href, label }) => (
          <li key={href} className={pathname === href ? TabBarStyle.active : ''}>
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TabBar;
