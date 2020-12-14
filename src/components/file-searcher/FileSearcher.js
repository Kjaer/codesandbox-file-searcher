import { useEffect, useState } from "react";
import { useMiniSearch } from 'react-minisearch'

import SearchForm from "./search-form/SearchForm";
import FileTree from "./file-tree/FileTree";
import Status from "./status/Status";
import { fetchSandbox } from "../../api/SandboxAPI";

import styles from "./FileSearcher.module.css";

const myTokenizer = require('wink-tokenizer')();

// Full Text Search Engine
const stopWords = new Set(['the', 'a', 'an'])
const searchOptions = {
  fields: ['code'],
  storeFields: ['title', 'code'],
  processTerm: (term) => stopWords.has(term) ? null : term,
  tokenize: (text) =>  myTokenizer.tokenize(text).map(({value}) => value.toLowerCase()),
  searchOptions: {
    fuzzy: false,
    prefix: true
  }
};


function FileSearcher(props) {
  const {
    search,
    searchResults,
    addAllAsync,
    isIndexing
  } = useMiniSearch(props.sandboxFiles, searchOptions);
  const [userInput, setUserInput] = useState({ isCaseSensitive: false, searchTerm: '' })

  useEffect(() => {
    if (!props.sandboxFiles.length) {
      return
    }

    addAllAsync(props.sandboxFiles)

  }, [props.sandboxFiles.length])

  // status is computed value based on other states and props value.
  const status = ((sandboxFilesCount, indexingFiles) => {
    if (sandboxFilesCount === 0) {
      return "files are gathering...";
    }

    if (indexingFiles) {
      return "file indexing is in progress...";
    }

    return ""
  })(props.sandboxFiles.length, isIndexing);

  function executeSearch(searchTerm, isCaseSensitive = false) {
    search(searchTerm, {
      processTerm(term) {
        if(stopWords.has(term)) {
          return null;
        }
        return isCaseSensitive ? term : term.toLowerCase()
      }
    })

    setUserInput({
      searchTerm,
      isCaseSensitive
    })
  }

  return(
    <aside className={styles.wrapper}>
      <h3 className={styles.title}>Search</h3>

      <SearchForm invokeSearch={executeSearch} />

      <Status message={status} isLoading={Boolean(status.length)} />

      <FileTree files={searchResults} userInput={userInput} />
    </aside>
  )
}

function withSandboxFiles(Component) {
  return function (props) {
    const [sandboxFiles, setSandboxFiles] = useState([]);

    useEffect(() => {
      fetchSandbox()
        .then(sandbox => sandbox.data.modules.filter(file => !file.is_binary))
        .then(setSandboxFiles)
    }, []);

    return (
      <Component {...props} sandboxFiles={sandboxFiles} />
    )
  }
}

export default withSandboxFiles(FileSearcher)
