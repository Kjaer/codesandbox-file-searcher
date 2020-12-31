import { useState, useRef, Fragment } from "react";

// Components
import SearchInput from "./SearchInput";

// Styles
import styles from "./SearchForm.module.css";

export default function SearchForm(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCaseSensitive, setCaseSensitivity] = useState(false);
  const inputSearchElement = useRef(null);

  function onSearchSubmit() {
    if (
      inputSearchElement.current &&
      !inputSearchElement.current.checkValidity()
    ) {
      inputSearchElement.current.reportValidity();
      return;
    }

    props.invokeSearch(searchTerm, isCaseSensitive);
  }

  return (
    <Fragment>
      <SearchInput
        ref={inputSearchElement}
        setSearchTerm={setSearchTerm}
        setCaseSensitivity={setCaseSensitivity}
        onSearchKeyDown={onSearchSubmit}
      />

      <hr className={styles.divider} />

      <button
        className={styles.submitButton}
        onClick={onSearchSubmit}
        data-testid="csbx-file-search-submit-button"
      >
        Search
      </button>

      <hr className={styles.divider} />
    </Fragment>
  );
}
