import styles from "./Status.module.css";

export default function Status(props) {
  const { message, isLoading, hasResult } = props;

  if (message === "") {
    return null;
  }

  const stateClasses = [
    styles.status,
    isLoading && styles.loading,
    hasResult && styles.hasResult
  ]
    .filter((condition) => condition)
    .join(" ");

  return <p className={stateClasses}>{message}</p>;
}
