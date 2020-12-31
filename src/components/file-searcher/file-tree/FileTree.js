/*global globalThis*/
/*eslint no-undef: "error"*/

import { Fragment } from "react";

// Components
import FileNode from "./FileNode";
import Status from "../status/Status";

// Styles
import styles from "./FileTree.module.css";

export default function FileTree(props) {
  if (props.files === null) {
    return null;
  }

  const files = props.files
    .map(({ id, code, title }) => ({
      id,
      name: title,
      matches: findOccurrencesAndHighlight(code, props.userInput)
    }))
    .filter(({ matches }) => matches.occurrence > 0);
    
  const uniqueFileKeys =
    files.length > 0
      ? globalThis.crypto.getRandomValues(new Uint16Array(files.length))
      : [];

  const totalOccurrences = files.reduce(
    (total, file) => total + file.matches.occurrence,
    0
  );

  // status is computed value based on other variables and props value.
  const status = ((filesCount, occurrences) => {
    if (filesCount === 0) {
      return "No results";
    }

    return `${occurrences} results in ${filesCount} files`;
  })(files.length, totalOccurrences);

  return (
    <Fragment>
      <Status message={status} hasResult={files.length > 0} />

      <section className={styles.container}>
        {files.map((file, idx) => (
          <FileNode key={uniqueFileKeys[idx]} file={file} />
        ))}
      </section>
    </Fragment>
  );
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
    const beforeCursor = source.lastIndexOf("\n", cursor) + 1;
    const afterCursor = source.indexOf("\n", cursor);

    const prefix = source.slice(beforeCursor, cursor).trimLeft();
    const suffix = source
      .slice(cursor + pattern.length, afterCursor)
      .trimRight();
    const searchKeyWord = source.slice(cursor, cursor + pattern.length);

    return {
      prefix,
      searchTerm: searchKeyWord,
      suffix
    };
  }

  cursor = sourceCode.indexOf(pattern, nextCursor);
  while (cursor > -1) {
    occurrence++;
    nextCursor = cursor + pattern.length;

    const line = getSlice(source, searchTerm, cursor);
    highlighted.push(line);

    cursor = sourceCode.indexOf(pattern, nextCursor);
  }

  return {
    occurrence,
    highlighted
  };
}
