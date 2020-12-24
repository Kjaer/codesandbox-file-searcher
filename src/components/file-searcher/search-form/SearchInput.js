import { useRef, forwardRef } from "react";

// Styles
import styles from "./SearchInput.module.css";

function SearchInput(props, ref) {
  const {
    iconSearch,
    iconCaseSensitivityToggle,
    setSearchTerm,
    setCaseSensitivity
  } = props;

  const searchContainer = useRef(null);

  const onTextChange = (event) => {
    const { value: searchTerm } = event.target;

    setSearchTerm(searchTerm);
  };

  const onKeyDown = ({ key }) => {
    if (key !== "Enter") {
      return;
    }

    props.onSearchKeyDown();
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

  // render
  function addSearchIcon(SearchIcon) {
    if (!SearchIcon) {
      return null;
    }

    return (
      <div className={styles.wrapper}>
        <SearchIcon size={16} />
      </div>
    );
  }

  function addCaseSensitivityToggle(MatchCaseToggleIcon, onChangeHandler) {
    if (!MatchCaseToggleIcon) {
      return null;
    }

    return (
      <div className={styles.wrapper}>
        <label
          className={styles.caseSensitivityToggle}
          data-testid="csbx-file-search-case-sensitivity-toggle"
        >
          <input type="checkbox" onChange={onChangeHandler} />
          <MatchCaseToggleIcon size={16} />
        </label>
      </div>
    );
  }

  return (
    <div ref={searchContainer} className={styles.container}>
      {addSearchIcon(iconSearch)}

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

      {addCaseSensitivityToggle(
        iconCaseSensitivityToggle,
        onToggleCaseSensitive
      )}
    </div>
  );
}

export default forwardRef(SearchInput);
