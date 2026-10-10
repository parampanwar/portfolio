import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

// Let Lenis own in-page anchors; Next owns navigation between pages.
export default function SiteLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return href.includes("#") ? <a href={href} {...props} /> : <Link href={href} {...props} />;
}
