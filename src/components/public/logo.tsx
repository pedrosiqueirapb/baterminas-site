import Image from "next/image";
import { publicImageUrl } from "@/services/content";

/** Logo oficial. Usa o arquivo enviado pelo painel, se houver; senão /logo.png (arquivo oficial no repositório). */
export function Logo({ path, size = 56 }: { path?: string; size?: number }) {
  const src = publicImageUrl(path) ?? "/logo.png";
  return (
    <Image src={src} alt="Baterminas" width={size} height={size} priority={size > 0} className="h-auto w-auto" style={{ height: size, width: size }} />
  );
}
