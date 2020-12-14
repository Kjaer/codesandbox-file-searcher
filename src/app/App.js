import React from "react";

import "../theme/theme.css";
/*
 * Please don't freak out seeing what the heck is .scss here,
 * It's a trade-off. I put the further explanation inside the animations.scss
*/
import "../lib/animation.scss";
import styles from "./App.module.css";

import FileSearcher from "../components/file-searcher/FileSearcher";

export default function App() {
  return (
    <main className={styles.app}>
      <FileSearcher />
    </main>
  );
}
