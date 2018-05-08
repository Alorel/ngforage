<details>
  <summary>3.2.0</summary>

  [Diff from 3.1.0](https://github.com/Alorel/ngforage/compare/3.1.0...3.2.0)

  <ul>
    <li><strong>feat:</strong> Added toString() methods which return a JSON-encoded string of an object to all relevant classes.</li>
    <li><strong>refactor:</strong> Symbol.toStringTag is now added without a support check as the polyfill is required by Angular</li>
    <li><strong>refactor:</strong> Refactored internal and private methods + properties</li>
    <li><strong>refactor:</strong> Removed extraneous @Injectable() decorations on classes that have factories</li>
  </ul>
</details>

<details>
  <summary>3.1.0</summary>

  [Diff from 3.0.5](https://github.com/Alorel/ngforage/compare/3.0.5...3.1.0)

  <ul>
    <li><strong>feat:</strong> The library now makes use of better tree-shakeability provided by Angular 6.</li>
  </ul>
</details>

<details>
  <summary>3.0.5</summary>

  [Diff from 3.0.4](https://github.com/Alorel/ngforage/compare/3.0.4...3.0.5)

  <ul>
    <li><strong>fix:</strong> sessionStorage not defined bug fixed in <a href="https://github.com/Alorel/ngforage/pull/60">!60</a></li>
  </ul>
</details>

<details>
  <summary>3.0.4</summary>

  [Diff from 3.0.3](https://github.com/Alorel/ngforage/compare/3.0.3...3.0.4)

  <ul>
    <li><strong>fix:</strong> Package metadata for AoT compilation should now be generated correctly.</li>
  </ul>
</details>

<details>
  <summary>3.0.3</summary>

  [Diff from 3.0.2](https://github.com/Alorel/ngforage/compare/3.0.2...3.0.3)

  <ul>
    <li><strong>documentation:</strong> Added missing documentation for localForage as a peer dependency</li>
  </ul>
</details>

<details>
  <summary>3.0.2</summary>

  [Diff from 3.0.1](https://github.com/Alorel/ngforage/compare/3.0.1...3.0.2)

  <ul>
    <li><strong>chore:</strong> Add package keywords to npm</li>
  </ul>
</details>

<details>
  <summary>3.0.1</summary>

  [Diff from 3.0.0](https://github.com/Alorel/ngforage/compare/3.0.0...3.0.1)

  <ul>
    <li><strong>fix:</strong> Fixed the README not generating properly for the packaged version</li>
  </ul>
</details>

<details>
  <summary>3.0.0</summary>

  [Diff from 2.1.1](https://github.com/Alorel/ngforage/compare/2.1.1...3.0.0)

  <ul>
    <li><strong>chore:</strong> Packaged with Angular 6-specific dependencies</li>
  </ul>
</details>

<details>
  <summary>2.1.1</summary>

  [Diff from 2.1.0](https://github.com/Alorel/ngforage/compare/2.1.0...2.1.1)

  <ul>
    <li><strong>chore:</strong> Flagged some internal variables as internal.</li>
  </ul>
</details>

<details>
  <summary>2.1.0</summary>

  [Diff from 2.0.4](https://github.com/Alorel/ngforage/compare/2.0.4...2.1.0)

  <ul>
    <li><strong>feat:</strong> Added toString() methods which return a JSON-encoded string of an object to all relevant classes.</li>
    <li><strong>refactor:</strong> Symbol.toStringTag is now added without a support check as the polyfill is required by Angular</li>
    <li><strong>refactor:</strong> Refactored internal and private methods + properties</li>
    <li><strong>refactor:</strong> Removed extraneous @Injectable() decorations on classes that have factories</li>
  </ul>
</details>

<details>
  <summary>2.0.4</summary>

  [Diff from 2.0.3](https://github.com/Alorel/ngforage/compare/2.0.3...2.0.4)

  <ul>
    <li><strong>fix:</strong> sessionStorage not defined bug fixed in <a href="https://github.com/Alorel/ngforage/pull/60">!60</a></li>
  </ul>
</details>

<details>
  <summary>2.0.3</summary>

  [Diff from 2.0.2](https://github.com/Alorel/ngforage/compare/2.0.2...2.0.3)

  <ul>
    <li><strong>fix:</strong> Package metadata for AoT compilation should now be generated correctly.</li>
  </ul>
</details>

<details>
  <summary>2.0.2</summary>

  [Diff from 2.0.1](https://github.com/Alorel/ngforage/compare/2.0.1...2.0.2)

  <ul>
    <li><strong>documentation:</strong> Added missing documentation for localForage as a peer dependency</li>
  </ul>
</details>

<details>
  <summary>2.0.1</summary>

  [Diff from 2.0.0](https://github.com/Alorel/ngforage/compare/2.0.0...2.0.1)

  <ul>
    <li><strong>fix:</strong> Fixed the README not generating properly for the packaged version</li>
  </ul>
</details>

<details>
  <summary>2.0.0</summary>

  [Diff from 1.0.5](https://github.com/Alorel/ngforage/compare/1.0.5...2.0.0)

  <ul>
    <li><strong>breaking:</strong> NgForageModule must now be imported in the app module via `NgForageModule.forRoot()`</li>
    <li><strong>breaking:</strong> localForage is now a peer dependency</li>
    <li><strong>build:</strong> The library is now packaged with ng-packagr</li>
    <li><strong>feat:</strong> A sessionStorage wrapper driver is now available</li>
    <li><strong>feat:</strong> NgForage and NgForageCache instances can now be cloned - this is useful mainly for services that can't have a providers annotation</li>
  </ul>
</details>

<details>
  <summary>1.0.5</summary>

  [Diff from 1.0.4](https://github.com/Alorel/ngforage/compare/1.0.4...1.0.5)

  <ul>
    <li><strong>test:</strong> Added Firefox and Safari tests</li>
  </ul>
</details>

<details>
  <summary>1.0.4</summary>

  [Diff from 1.0.3](https://github.com/Alorel/ngforage/compare/1.0.3...1.0.4)

  <ul>
    <li><strong>chore:</strong> Core refactored</li>
    <li><strong>demo:</strong> Demo is now available offline</li>
  </ul>
</details>

<details>
  <summary>1.0.3</summary>

  [Diff from 1.0.2](https://github.com/Alorel/ngforage/compare/1.0.2...1.0.3)

  <ul>
    <li><strong>chore:</strong> README link fix</li>
  </ul>
</details>

<details>
  <summary>1.0.2</summary>

  [Diff from 1.0.1](https://github.com/Alorel/ngforage/compare/1.0.1...1.0.2)

  <ul>
    <li><strong>chore:</strong> Fixed CDN links</li>
    <li><strong>chore:</strong> Package cleanup</li>
  </ul>
</details>

<details>
  <summary>1.0.1</summary>

  <ul>
    <li><strong>chore:</strong> Package cleanup</li>
    <li><strong>fix:</strong> Fixed demo site generation</li>
  </ul>
</details>
