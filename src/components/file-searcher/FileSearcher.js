import { useEffect, useState } from "react";
import MiniSearch from "minisearch";
import { tokenize } from "string-punctuation-tokenizer";

// API
import { fetchSandbox } from "../../api/SandboxAPI";

// Components
import SearchForm from "./search-form/SearchForm";
import FileTree from "./file-tree/FileTree";
import Status from "./status/Status";

// Styles
import styles from "./FileSearcher.module.css";

// Initial State for search engine
function initSearchEngine(stopWords) {
  // Tokenizer options
  const tokenizerOptions = {
    includeWords: true,
    includeNumbers: true,
    includeWhitespace: false,
    includePunctuation: true,
    includeUnknown: true,
    greedy: true,
    verbose: false
  };

  // Full Text Search Engine options
  const searchOptions = {
    fields: ["code"],
    storeFields: ["title", "code"],
    processTerm: (term) => (stopWords.has(term) ? null : term),
    tokenize: (text) => tokenize({ text, ...tokenizerOptions }).map((token) => token.toLowerCase()),
    searchOptions: {
      fuzzy: false,
      prefix: true
    }
  };

  return new MiniSearch(searchOptions);
}

function FileSearcher(props) {
  const { sandboxFiles } = props;
  const stopWords = new Set(["the", "a", "an"]);

  const [miniSearch] = useState(() => initSearchEngine(stopWords));
  const [isIndexing, setIndexing] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [userInput, setUserInput] = useState({
    isCaseSensitive: false,
    searchTerm: ""
  });

  useEffect(() => {
    if (!sandboxFiles.length) {
      return;
    }

    setIndexing(true);

    miniSearch
      .addAllAsync(sandboxFiles)
      .then((result) => setIndexing(Boolean(result)));
  }, [miniSearch, sandboxFiles]);

  // status is computed value based on other states and props value.
  const status = ((sandboxFilesCount, indexingFiles) => {
    if (sandboxFilesCount === 0) {
      return "files are gathering...";
    }

    if (indexingFiles) {
      return "file indexing is in progress...";
    }

    return "";
  })(sandboxFiles.length, isIndexing);

  function executeSearch(searchTerm, isCaseSensitive = false) {
    const results = miniSearch.search(searchTerm, {
      processTerm: (term) => {
        if (stopWords.has(term)) {
          return null;
        }

        return isCaseSensitive ? term : term.toLowerCase();
      }
    });

    setSearchResults(results)

    setUserInput({
      searchTerm,
      isCaseSensitive
    });
  }

  return (
    <aside className={styles.wrapper}>
      <h3 className={styles.title}>Search</h3>

      <SearchForm invokeSearch={executeSearch} />

      <Status message={status} isLoading={Boolean(status.length)} />

      <FileTree files={searchResults} userInput={userInput} />
    </aside>
  );
}

function withSandboxFiles(Component) {
  return function (props) {
    const [sandboxFiles, setSandboxFiles] = useState([]);

    useEffect(() => {
      fetchSandbox()
        .then((sandbox) =>
          sandbox.data.modules.filter((file) => !file.is_binary)
        )
        .then(setSandboxFiles);
    }, []);

    return <Component {...props} sandboxFiles={sandboxFiles} />;
  };
}

export default withSandboxFiles(FileSearcher);
