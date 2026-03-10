import * as React from "react";
import Image, { type ImageProps } from "next/image";

type PixellobsterProps = Omit<ImageProps, "src" | "alt"> & {
  alt?: string;
};

export function SvgConverted({
  alt,
  width = 1024,
  height,
  "aria-label": ariaLabel,
  ...props
}: PixellobsterProps) {
  const resolvedWidth = typeof width === "number" ? width : 1024;
  const resolvedHeight = typeof height === "number" ? height : resolvedWidth;

  return (
    <Image
      src="/pixellobster.svg"
      alt={alt ?? ariaLabel ?? "Pixel lobster"}
      width={resolvedWidth}
      height={resolvedHeight}
      unoptimized
      {...props}
    />
  );
}

export default SvgConverted;
