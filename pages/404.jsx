// pages/404.js
import Link from 'next/link'
import styles from '../styles/404.module.css' // Optional: for custom styling
import MousePointer from '../components/MousePointer'

export default function NotFound() {
  return (
    
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Oops! Page Not Found</h2>
      <p className={styles.message}>
        The page you are looking for might have been removed or doesn't exist.
      </p>
      <Link href="/" className={styles.button}>
        Go Back Home
      </Link>
    </div>
  )
}
