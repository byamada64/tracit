"use client";

import { usePathname } from "next/navigation";
import { bannerConfig } from "../../config/banners";
import { bannerTheme } from "../../config/theme";
import styles from "./Banner.module.css";

export default function Banner() {
  const pathname = usePathname();
  const route = pathname === "/" ? "dashboard" : pathname.replace("/", "");
  const config = bannerConfig[route];

  return (
    <div className={styles.bannerWrapper}>
      <div
        className={styles.banner}
        style={{
          "--banner-background": bannerTheme.background,
          "--banner-padding": bannerTheme.padding,
          "--banner-radius": bannerTheme.radius,
          "--banner-max-width": bannerTheme.maxWidth,
          "--banner-horizontal-margin": bannerTheme.horizontalMargin,
        }}
      >
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>
            {config?.title || "(Missing bannerConfig title)"}
          </h1>

          <p className={styles.bannerDescription}>
            {config?.description || "No description configured."}
          </p>
        </div>

        <div className={styles.bannerIcon}>
          {config?.icon || "⚠️"}
        </div>
      </div>
    </div>
  );
}
