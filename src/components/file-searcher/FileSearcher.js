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
function setupSearchEngine(stopWords) {
  // Tokenizer options
  const tokenizerOptions = {
    includeWords: true,
    includeNumbers: true,
    includePunctuation: true,
    includeUnknown: true,
    includeWhitespace: false,
    greedy: false,
    verbose: false
  };

  // Full Text Search Engine options

  // Stopwords are taken from here: https://github.com/NaturalNode/natural/blob/master/lib/natural/util/stopwords.js
  // const stopWords = new Set(["about","above","after","again","all","also","am","an","and","another","any","are","as","at","be","because","been","before","being","below","between","both","but","by","came","can","cannot","come","could","did","do","does","doing","during","each","few","for","from","further","get","got","has","had","he","have","her","here","him","himself","his","how","if","in","into","is","it","its","itself","like","make","many","me","might","more","most","much","must","my","myself","never","now","of","on","only","or","other","our","ours","ourselves","out","over","own","said","same","see","should","since","so","some","still","such","take","than","that","the","their","theirs","them","themselves","then","there","these","they","this","those","through","to","too","under","until","up","very","was","way","we","well","were","what","where","when","which","while","who","whom","with","would","why","you","your","yours","yourself","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","$","1","2","3","4","5","6","7","8","9","0",]);
  // processTerm: (term) => (stopWords.has(term) ? null : term),

  const searchEngineOptions = {
    fields: ["code"],
    storeFields: ["title", "code"],
    tokenize: (text) =>
      tokenize({ text, ...tokenizerOptions })
        .reduce((tokenList, token) => {
          const whiteSpace = /\s/g;
          const camelCasedToken = token.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

          if (whiteSpace.test(camelCasedToken)) {
            tokenList.push(...camelCasedToken.split(" "));
          } else {
            tokenList.push(token);
          }

          return tokenList;
        }, [])
        .map((token) => token.toLowerCase()),
    searchOptions: {
      fuzzy: false,
      prefix: true
    }
  };

  return new MiniSearch(searchEngineOptions);
}

function FileSearcher(props) {
  const { sandboxFiles } = props;

  const [miniSearch] = useState(() => setupSearchEngine());
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
      processTerm: (term) => (isCaseSensitive ? term : term.toLowerCase())
    });

    setSearchResults(results);

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
