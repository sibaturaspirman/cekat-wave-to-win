import styles from "./offline.module.css";

export default function OfflinePage() {
  return (
    <main className={styles.page}>
      <p className={styles.brand}>Wave to Win</p>
      <h1 className={styles.title}>You’re offline</h1>
      <p className={styles.copy}>
        Open the app once while online to cache assets, then it can run without
        a network.
      </p>
      <a className={styles.button} href="/">
        Retry
      </a>
    </main>
  );
}
