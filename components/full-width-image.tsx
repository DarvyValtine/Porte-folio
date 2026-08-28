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
        className={`mx-auto my-1 block h-auto max-h-[60vh] w-full rounded-lg ${frame}`}
      />
    );
  }

  if (maxHeight) {
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

  if (!dims) {
    return (
      <span
        className={`relative mx-auto my-1 block w-full overflow-hidden rounded-lg ${frame}`}
        style={{ minHeight: "12rem" }}
      >
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          loading="lazy"
          decoding="async"
          className="object-cover"
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
      className={`mx-auto block h-auto w-full rounded-lg ${frame}`}
      style={maxHeight ? { maxHeight } : undefined}
      sizes={sizes}
    />
  );
}
