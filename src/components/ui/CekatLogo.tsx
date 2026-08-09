import styles from "./CekatLogo.module.css";

type CekatLogoProps = {
  className?: string;
};

export function CekatLogo({ className }: CekatLogoProps) {
  return (
    <div className={`${styles.logo} ${className ?? ""}`.trim()}>
      <img
        src="/assets/logo-cekat.png"
        alt="Cekat.AI"
        width={1011}
        height={224}
        className={styles.image}
        draggable={false}
      />
    </div>
  );
}
