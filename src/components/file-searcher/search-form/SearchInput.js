import { useRef, forwardRef } from "react";

// Components
import { SearchIcon, MatchCaseIcon } from "../../../lib/icons";

// Styles
import styles from "./SearchInput.module.css";

function SearchInput(props, ref) {
  const { setSearchTerm, setCaseSensitivity, onSearchKeyDown } = props;

  const searchContainer = useRef(null);

  const onTextChange = (event) => {
    const { value: searchTerm } = event.target;

    setSearchTerm(searchTerm);
  };

  const onKeyDown = ({ key }) => {
    if (key !== "Enter") {
      return;
    }

    onSearchKeyDown();
  };

  const onToggleCaseSensitive = (event) => {
    const { checked: caseSensitivity } = event.target;

    setCaseSensitivity(caseSensitivity);
  };

  function onHighlight() {
    const classList = Array.from(searchContainer.current.classList);

    if (classList.includes(styles.containerActive)) {
      searchContainer.current.classList.remove(styles.containerActive);
    } else {
      searchContainer.current.classList.add(styles.containerActive);
    }
  }

  return (
    <div ref={searchContainer} className={styles.container}>
      <div className={styles.wrapper}>
        <SearchIcon size={16} />
      </div>

      <div className={[styles.wrapper, styles.wrapperLarge].join(" ")}>
        <input
          ref={ref}
          type="search"
          className={styles.searchInput}
          autoComplete="off"
          placeholder="Search"
          required
          minLength="3"
          onChange={onTextChange}
          onKeyDown={onKeyDown}
          onFocus={onHighlight}
          onBlur={onHighlight}
          data-testid="csbx-file-search-text-input"
        />
      </div>

      <div className={styles.wrapper}>
        <label
          className={styles.caseSensitivityToggle}
          data-testid="csbx-file-search-case-sensitivity-toggle"
        >
          <input type="checkbox" onChange={onToggleCaseSensitive} />
          <MatchCaseIcon size={16} />
        </label>
      </div>
    </div>
  );
}

export default forwardRef(SearchInput);
