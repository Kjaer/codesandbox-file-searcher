import styles from "./FileTree.module.css";

import Status from "../status/Status";
import {Fragment} from "react";

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
  const status = ((filesCount)=>{
    if (filesCount === 0 || totalOccurrences === 0) {
      return "No results"
    }

    return `${totalOccurrences} results in ${filesCount} files`
  })(files.length, totalOccurrences)

  return(
    <Fragment>
      <Status message={status} hasResult={files.length > 0}/>

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
  return(
    <details className={styles.fileNode} open>
      <summary
        className={styles.file}
        data-testid={`csbx-file-search-file-name-${props.file.id}`}
      >
        <span className={styles.fileName}>{props.file.name}</span>
      </summary>
      <ul
        className={[
          styles.foundLines,
          `slideDown-${props.file.matches.highlighted.length}`
        ].join(" ")}
        data-testid={`csbx-file-search-file-occurrence-list-${props.file.id}`}
      >
        {props.file.matches.highlighted.map(({prefix, searchTerm, suffix}, idx) => (
          <li
            key={idx}
            className={styles.line}
          >
            {prefix}<mark className={styles.highlight} data-testid={`csbx-file-search-highlighted-term-${props.file.id}-${idx}`}>{searchTerm}</mark>{suffix}
          </li>
        ))}
      </ul>
    </details>
  )
}
