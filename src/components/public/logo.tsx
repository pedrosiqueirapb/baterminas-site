import Image from "next/image";
import { publicImageUrl } from "@/services/content";

/** Logo oficial, sem link. Usa o arquivo enviado pelo painel, se houver; senão /logo.png. */
export function Logo({ path, size = 56 }: { path?: string; size?: number }) {
  const src = publicImageUrl(path) ?? "/logo.png";
  return <Image src={src} alt="Baterminas" width={size} height={size} priority style={{ height: size, width: size }} />;
}
