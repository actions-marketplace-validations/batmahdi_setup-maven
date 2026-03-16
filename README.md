# Setup Apache Maven — GitHub Action

[![CI](https://github.com/batmahdi/setup-maven/actions/workflows/ci.yml/badge.svg)](https://github.com/batmahdi/setup-maven/actions/workflows/ci.yml)

This action downloads and installs a specific version of [Apache Maven](https://maven.apache.org/) and adds it to `PATH`. It works on **Linux**, **macOS**, and **Windows** runners.

## Usage

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-java@v4
    with:
      distribution: temurin
      java-version: 17

  - uses: batmahdi/setup-maven@v2
    with:
      maven-version: '3.9.9'   # optional — defaults to 3.9.9

  - run: mvn --version
```

## Inputs

| Input           | Description                          | Default |
| --------------- | ------------------------------------ | ------- |
| `maven-version` | Exact Maven version to install       | `3.9.9` |

## Outputs

| Output          | Description                              |
| --------------- | ---------------------------------------- |
| `maven-version` | The Maven version that was installed     |
| `maven-path`    | Filesystem path to the Maven installation |

The action also exports the `M2_HOME` environment variable.

## Caching

Maven binaries are cached in the [runner tool cache](https://github.com/actions/toolkit/tree/main/packages/tool-cache), so repeated runs with the same version skip the download.

## License

[MIT](LICENSE)
