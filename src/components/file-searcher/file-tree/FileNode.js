/*global globalThis*/
/*eslint no-undef: "error"*/

import { useLayoutEffect, createRef } from "react";

// Styles
import styles from "./FileNode.module.css";

export default function FileNode(props) {
  const {
    file,
    file: {
      matches: { highlighted }
    }
  } = props;

  const highlightsRefs = Array.from({ length: highlighted.length }, () =>
    createRef()
  );

  useLayoutEffect(() => {
    highlightsRefs.forEach(({ current: container }) =>
      moveHighlightsInViewport(container)
    );
  }, [highlightsRefs]);

  return (
    <details className={styles.fileNode} open>
      <summary
        className={styles.file}
        data-testid={`csbx-file-search-file-name-${file.id}`}
      >
        <span className={styles.name}>{file.name}</span>
      </summary>
      <ul
        className={[styles.occurrences, `slideDown-${highlighted.length}`].join(
          " "
        )}
        data-testid={`csbx-file-search-file-occurrence-list-${file.id}`}
      >
        {highlighted.map(({ prefix, searchTerm, suffix }, idx) => (
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
  );
}

function moveHighlightsInViewport(container) {
  const containerBounds = container.getBoundingClientRect();
  const highlightedTermBounds = container
    .querySelector(`mark.${styles.highlight}`)
    .getBoundingClientRect();

  /*
   * values below fetching from the css file. Spaces are necessary values in order to shift the highlighted
   * value in the viewport.By doing so, I eliminate the direct coupling between FileNode component and
   * FileTree component in JS file but CSS file. Tradeoff is FileNode does not have to be inform or
   * interfere of FileTree's implementation details but it need to know of regarding styles (spaces) changes
   * via css variables and it has to be done manually.
   */

  const containerSpace = parseInt(
    globalThis.getComputedStyle(container).getPropertyValue("--parent-space"),
    10
  );
  const wrapperSpace = parseInt(
    globalThis.getComputedStyle(container).getPropertyValue("--wrapper-space"),
    10
  );
  const scrollSpace = parseInt(
    globalThis.getComputedStyle(container).getPropertyValue("--scroll-space"),
    10
  );
  const spaces = containerSpace + wrapperSpace + scrollSpace;

  const highlightedTermPosition = highlightedTermBounds.left + spaces;

  if (highlightedTermPosition > containerBounds.right) {
    const termElementLeft = Math.ceil(highlightedTermBounds.left);
    const containerElementRight = Math.ceil(containerBounds.right);
    const termLong = Math.ceil(highlightedTermBounds.width);

    container.style.textIndent =
      (termElementLeft - containerElementRight + termLong + spaces) * -1 + "px";
  }
}
