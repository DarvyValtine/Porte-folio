"use client"

import { useState } from "react"

type SafeImageProps = {
  src: string | null | undefined
  alt: string
  className?: string
  width?: number
  height?: number
}

export function SafeImage({
  src,
  alt,
  className = "",
  width,
  height,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return null

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  )
}
