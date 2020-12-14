import styles from "./Status.module.css";

export default function Status(props) {
  const {
    message,
    isLoading,
    hasResult
  } = props

  const state = [
    styles.status,
    isLoading && styles.loading,
    hasResult && styles.hasResult
  ]
    .filter(condition => condition)
    .join(" ");

  if (message === "") {
    return null
  }

  return (
    <p className={state}>
      {message}
    </p>
  )
}
