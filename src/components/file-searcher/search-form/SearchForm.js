import { useState, useRef, Fragment } from "react";

// Components
import SearchInput from "./SearchInput";
import { SearchIcon, MatchCaseIcon } from "../../../lib/icons";

// Styles
import styles from "./SearchForm.module.css";

export default function SearchForm(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCaseSensitive, setCaseSensitivity] = useState(false);
  const inputSearchElement = useRef(null);

  function onSearchSubmit() {
    if (searchTerm === "" || searchTerm.length < 3) {
      inputSearchElement.current && inputSearchElement.current.reportValidity();
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
        iconSearch={SearchIcon}
        iconCaseSensitivityToggle={MatchCaseIcon}
        onSearchKeyDown={onSearchSubmit}
      />

      <hr className={styles.divider} />

      <button className={styles.submitButton} onClick={onSearchSubmit}>
        Search
      </button>

      <hr className={styles.divider} />
    </Fragment>
  );
}
