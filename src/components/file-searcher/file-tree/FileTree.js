import { Fragment, useLayoutEffect, useRef, createRef } from "react";

// Components
import Status from "../status/Status";

// Styles
import styles from "./FileTree.module.css";


export default function FileTree(props) {
  if (props.files === null) {
    return null
  }

  const files = props.files
    .map(({id, code, title}) => ({
      id,
      name: title,
      matches: findOccurrencesAndHighlight(code, props.userInput)
    }))
    .filter(({ matches }) => matches.occurrence > 0)

  const totalOccurrences = files.reduce((total, file) => total + file.matches.occurrence, 0);

  // status is computed value based on other variables and props value.
  const status = ((filesCount, occurrences)=>{
    if (filesCount === 0 || occurrences === 0) {
      return "No results"
    }

    return `${occurrences} results in ${filesCount} files`
  })(files.length, totalOccurrences)

  return(
    <Fragment>
      <Status message={status} hasResult={files.length > 0}/>

      {/*
        Reason I am adding index number into key, resetting the component for every new search result,
        if the current search result has the same file from the previous search result,
        It will preserve previous search condition, and key comes to help the reset the previous condition of the component.
      */}
      <section className={styles.container}>
        {files.map((file, idx) => (
          <FileNode
            key={`${file.id}-${idx}`}
            file={file}
          />
        ))}
      </section>
    </Fragment>
  )
}

function FileNode(props) {
  const { file, file: { matches: { highlighted } } } = props

  const { current: highlightsRefs } = useRef(Array.from({ length: highlighted.length }, () => createRef(null)))

  function moveHighlightsInViewport(container) {
    const containerBounds = container.getBoundingClientRect();
    const highlightedTermBounds = container.querySelector(`mark.${styles.highlight}`).getBoundingClientRect();
    /*
     * values below fetching from the css file. By doing so, I will eliminate the direct coupling between FileNode
     * component and FileTree component.
     * Spaces below are necessary values in order to shift the highlighted value in the viewport.
     */
    const containerSpace = parseInt(getComputedStyle(container).getPropertyValue('--parent-space'));
    const wrapperSpace = parseInt(getComputedStyle(container).getPropertyValue('--wrapper-space'));
    const scrollSpace = parseInt(getComputedStyle(container).getPropertyValue('--scroll-space'));

    const highlightedTermPosition = highlightedTermBounds.left + containerSpace + wrapperSpace + scrollSpace;

    if ( highlightedTermPosition > containerBounds.right) {
      const termElementLeft = Math.ceil(highlightedTermBounds.left);
      const containerElementRight = Math.ceil(containerBounds.right);
      const termLong = Math.ceil(highlightedTermBounds.width);
      const spaces = containerSpace + wrapperSpace + scrollSpace;

      container.style.textIndent = (((termElementLeft - containerElementRight) + termLong + spaces) * -1) + "px";
    }
  }

  useLayoutEffect(() => {
    highlightsRefs.forEach(({current:container}) => moveHighlightsInViewport(container))
  }, [])

  return(
    <details className={styles.fileNode} open>
      <summary
        className={styles.file}
        data-testid={`csbx-file-search-file-name-${file.id}`}
      >
        <span className={styles.name}>{file.name}</span>
      </summary>
      <ul
        className={[
          styles.foundLines,
          `slideDown-${highlighted.length}`
        ].join(" ")}
        data-testid={`csbx-file-search-file-occurrence-list-${file.id}`}
      >
        {highlighted.map(({prefix, searchTerm, suffix}, idx) => (
          <li
            key={`${file.id}-${idx}`}
            ref={highlightsRefs[idx]}
            className={styles.line}
          >
            {prefix}
            <mark
              className={styles.highlight}
              data-testid={`csbx-file-search-highlighted-term-${file.id}-${idx}`}
            >
              {searchTerm}
            </mark>
            {suffix}
          </li>
          ))}
      </ul>
    </details>
  )
}

function findOccurrencesAndHighlight(source, userInput) {
  const { isCaseSensitive, searchTerm } = userInput;
  const pattern = isCaseSensitive ? searchTerm : searchTerm.toLowerCase();
  const sourceCode = isCaseSensitive ? source : source.toLowerCase();

  let cursor,
    nextCursor = 0,
    occurrence = 0,
    highlighted = [];

  function getSlice(source, pattern, cursor) {
    const beforeCursor =  source.lastIndexOf("\n", cursor) + 1;
    const afterCursor = source.indexOf("\n", cursor);

    const prefix = source.slice(beforeCursor, cursor).trimLeft();
    const suffix = source.slice(cursor + pattern.length, afterCursor).trimRight();
    const searchKeyWord = source.slice(cursor, cursor + pattern.length);
    return {
      prefix,
      searchTerm: searchKeyWord,
      suffix
    }
  }

  cursor = sourceCode.indexOf(pattern, nextCursor);
  while ( cursor > -1) {
    occurrence++;
    nextCursor = cursor + pattern.length;

    const line = getSlice(source, pattern, cursor);
    highlighted.push(line)

    cursor = source.indexOf(pattern, nextCursor);
  }

  return {
    occurrence,
    highlighted
  }
}
