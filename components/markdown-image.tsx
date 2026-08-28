"use client"

import Image from "next/image"
import { useState } from "react"

export function MarkdownImage({
  src,
  alt,
  width,
  height,
}: {
  src: string
  alt: string
  width?: number
  height?: number
}) {
  const isSvg = /\.svg($|\?)/i.test(src)
  const [ratio, setRatio] = useState<number>(width && height ? width / height : 16 / 9)

  if (isSvg) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="mx-auto my-1 block h-auto max-h-[60vh] w-full rounded-lg border border-border/60"
      />
    )
  }

  return (
    <span
      className="relative mx-auto my-1 block w-full overflow-hidden rounded-lg border border-border/60"
      style={{ aspectRatio: String(ratio) }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        decoding="async"
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
        onLoadingComplete={(result) => {
          if (result.naturalWidth && result.naturalHeight) {
            setRatio(result.naturalWidth / result.naturalHeight)
          }
        }}
      />
    </span>
  )
}
