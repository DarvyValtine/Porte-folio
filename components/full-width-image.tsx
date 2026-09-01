"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Dims = { w: number; h: number };

export function FullWidthImage({
  src,
  alt,
  width,
  height,
  className = "",
  sizes = "(max-width: 768px) 100vw, 768px",
  fit = "contain",
  maxHeight,
  fillFrame = true,
  bordered = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  fit?: "contain" | "cover";
  maxHeight?: string;
  /** When true (default), `maxHeight` becomes a fixed frame. When false, it caps height and keeps the natural ratio. */
  fillFrame?: boolean;
  bordered?: boolean;
}) {
  const isSvg = /\.svg($|\?)/i.test(src);
  const [dims, setDims] = useState<Dims | null>(
    width && height ? { w: width, h: height } : null,
  );
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth && img.naturalHeight) {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, [src]);

  const frame = `${bordered ? "border border-border/60" : ""} ${className}`;

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`mx-auto my-1 block w-full rounded-xl ${frame}`}
        style={{
          height: "auto",
          maxHeight: maxHeight ?? "60vh",
          objectFit: fit,
        }}
      />
    );
  }

  if (maxHeight && fillFrame) {
    return (
      <div
        className={`relative mx-auto my-1 block w-full overflow-hidden rounded-xl ${frame}`}
        style={{ height: maxHeight }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          decoding="async"
          className={fit === "cover" ? "object-cover" : "object-contain"}
          sizes={sizes}
        />
      </div>
    );
  }

  if (maxHeight && !fillFrame) {
    return (
      <Image
        src={src}
        alt={alt}
        width={dims?.w ?? width ?? 1600}
        height={dims?.h ?? height ?? 900}
        loading="lazy"
        decoding="async"
        className={`mx-auto my-1 block h-auto w-auto max-w-full rounded-xl ${frame}`}
        style={{ maxHeight, objectFit: fit }}
        sizes={sizes}
      />
    );
  }

  if (!dims) {
    return (
      <span
        className={`relative mx-auto my-1 block w-full overflow-hidden rounded-xl ${frame}`}
        style={{ minHeight: "12rem" }}
      >
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          loading="lazy"
          decoding="async"
          className={fit === "cover" ? "object-cover" : "object-contain"}
          sizes={sizes}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              setDims({ w: img.naturalWidth, h: img.naturalHeight });
            }
          }}
        />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={dims.w}
      height={dims.h}
      loading="lazy"
      decoding="async"
      className={`mx-auto block h-auto w-full rounded-xl ${frame}`}
      sizes={sizes}
    />
  );
}
