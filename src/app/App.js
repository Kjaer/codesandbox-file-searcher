import React from "react";

import "../theme/theme.css";
/*
 * Please don't freak out by seeing that what heck this .scss file doing here.
 * Using .scss file is trade-off over a npm dependency.
 * I put further explanation why I chose to use .scss
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
