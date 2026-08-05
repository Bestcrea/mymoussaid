import { useState } from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  linkTo?: string;
  variant?: "light" | "dark";
}

export function Logo({
  size = "md",
  linkTo = "/",
  variant = "light",
}: LogoProps) {
  const sizes = {
    sm: { img: 32, text: 14, sub: 9 },
    md: { img: 44, text: 17, sub: 10 },
    lg: { img: 56, text: 20, sub: 11 },
    xl: { img: 72, text: 24, sub: 12 },
  };

  const s = sizes[size];
  const isDark = variant === "dark";
  const [imageError, setImageError] = useState(false);

  const logoContent = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {!imageError && (
        <img
          src="/logo.png"
          alt="MyMoussaid"
          style={{
            height: s.img,
            width: "auto",
            objectFit: "contain",
          }}
          onError={() => setImageError(true)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
          <span
            style={{
              fontSize: s.text,
              fontWeight: 400,
              color: isDark ? "rgba(255,255,255,0.7)" : "#6B7280",
              fontFamily: "Inter, sans-serif",
            }}
          >
            My
          </span>
          <span
            style={{
              fontSize: s.text,
              fontWeight: 700,
              color: isDark ? "#FFFFFF" : "#1C1917",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Moussaid
          </span>
        </div>
        <span
          style={{
            fontSize: s.sub,
            fontWeight: 400,
            color: isDark ? "rgba(255,255,255,0.5)" : "#C47A1E",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: "3px",
          }}
        >
          Architecture &amp; Urbanisme
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: "none" }}>
        {logoContent}
      </Link>
    );
  }
  return logoContent;
}
