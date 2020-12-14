import { useState, useRef, Fragment } from 'react';
import { SearchIcon, MatchCaseIcon } from "../../../lib/icons";

import styles from "./SearchForm.module.css";

export default function SearchForm(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCaseSensitive, setCaseSensitivity] = useState(false);

  function onSearchSubmit() {
    if(searchTerm === '') {
      return;
    }

    props.invokeSearch(searchTerm, isCaseSensitive)
  }

  return(
    <Fragment>
      <SearchInput
        setSearchTerm={setSearchTerm}
        setCaseSensitivity={setCaseSensitivity}
        iconSearch={SearchIcon}
        iconCaseSensitivityToggle={MatchCaseIcon}
        onSearchKeyDown={onSearchSubmit}
      />

      <hr className={styles.divider}/>

      <button
        className={styles.submitButton}
        onClick={onSearchSubmit}
      >
          Search
      </button>

      <hr className={styles.divider}/>
    </Fragment>
  )
}

function SearchInput(props) {
  const {
    iconSearch,
    iconCaseSensitivityToggle,
    setSearchTerm,
    setCaseSensitivity
  } = props;

  const searchContainerElement = useRef(null)

  const onTextChange = (event) => {
    const { value: searchTerm } = event.target;

    setSearchTerm(searchTerm);
  }

  const onKeyDown = ({key}) => {
    if (key !== 'Enter') {
      return;
    }

    props.onSearchKeyDown();
  }

  const onToggleCaseSensitive = (event) => {
    const { checked: caseSensitivity } = event.target;

    setCaseSensitivity(caseSensitivity)
  }

  function onHighlight() {
    const classList = Array.from(searchContainerElement.current.classList);

    if (classList.includes(styles.searchInputContainerActive)){
      searchContainerElement.current.classList.remove(styles.searchInputContainerActive)
    } else {
      searchContainerElement.current.classList.add(styles.searchInputContainerActive)
    }
  }

  // render
  function addSearchIcon(SearchIcon) {
    if (!SearchIcon) {
      return null
    }

    return (
      <div className={styles.searchInputItem}>
        <SearchIcon size={16} />
      </div>
    )
  }

  function addCaseSensitivityToggle(MatchCaseToggleIcon, onChangeHandler){
    if (!MatchCaseToggleIcon) {
      return null
    }

    return (
      <div className={styles.searchInputItem}>
        <label
          className={styles.caseSensitivityToggle}
          data-testid="csbx-file-search-case-sensitivity-toggle"
        >
          <input
            type="checkbox"
            onChange={onChangeHandler}
          />
          <MatchCaseToggleIcon size={16} />
        </label>
      </div>
    )
  }

  return(
    <div
      ref={searchContainerElement}
      className={styles.searchInputContainer}
    >
      {addSearchIcon(iconSearch)}

      <div
        className={[
          styles.searchInputItem,
          styles.searchInputItemLarge
        ].join(" ")}
      >
        <input
          type="search"
          className={styles.searchInput}
          autoComplete="off"
          placeholder="Search"
          onChange={onTextChange}
          onKeyDown={onKeyDown}
          onFocus={onHighlight}
          onBlur={onHighlight}
          data-testid="csbx-file-search-text-input"
        />
      </div>

      {addCaseSensitivityToggle(iconCaseSensitivityToggle, onToggleCaseSensitive)}
    </div>
  )
}
