"use client"

import Image from "next/image"
import { useState } from "react"

type SafeImageProps = {
  src: string | null | undefined
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  className = "",
  width,
  height,
  fill,
  sizes,
  priority,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return null

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  )
}
