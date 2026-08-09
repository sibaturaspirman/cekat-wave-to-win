import Image from "next/image";
import styles from "./CekatLogo.module.css";

type CekatLogoProps = {
  className?: string;
};

export function CekatLogo({ className }: CekatLogoProps) {
  return (
    <div className={`${styles.logo} ${className ?? ""}`.trim()}>
      <Image
        src="/assets/logo-cekat.png"
        alt="Cekat.AI"
        width={1011}
        height={224}
        priority
        className={styles.image}
      />
    </div>
  );
}
