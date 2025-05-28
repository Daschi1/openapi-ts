import type { ClientPlugins, UserPlugins } from '../plugins';
import type { ArrayOfObjectsToObjectMap, ExtractArrayOfObjects } from './utils';

export type Formatters = 'biome' | 'prettier';

export type Linters = 'biome' | 'eslint' | 'oxlint';

export type StringCase =
  | 'camelCase'
  | 'PascalCase'
  | 'preserve'
  | 'snake_case'
  | 'SCREAMING_SNAKE_CASE';

interface Input {
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Projects are private by default, you will need to be authenticated
   * to download OpenAPI specifications. We recommend using project API
   * keys in CI workflows and personal API keys for local development.
   *
   * API key isn't required for public projects. You can also omit this
   * parameter and provide an environment variable `HEY_API_TOKEN`.
   */
  api_key?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * You can fetch the last build from branch by providing the branch
   * name.
   */
  branch?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * You can fetch an exact specification by providing a commit sha.
   * This will always return the same file.
   */
  commit_sha?: string;
  /**
   * You pass any valid Fetch API options to the request for fetching your
   * specification. This is useful if your file is behind auth for example.
   */
  fetch?: RequestInit;
  /**
   * Filters can be used to select a subset of your input before it's processed
   * by plugins.
   */
  filters?: {
    /**
     * Include deprecated resources in the output?
     *
     * @default true
     */
    deprecated?: boolean;
    operations?: {
      /**
       * Prevent operations matching the `exclude` filters from being processed.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['GET /api/v1/foo']
       */
      exclude?: ReadonlyArray<string>;
      /**
       * Process only operations matching the `include` filters.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['GET /api/v1/foo']
       */
      include?: ReadonlyArray<string>;
    };
    /**
     * Keep reusable components without any references in the output? By
     * default, we exclude orphaned resources.
     *
     * @default false
     */
    orphans?: boolean;
    parameters?: {
      /**
       * Prevent parameters matching the `exclude` filters from being processed.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['QueryParam']
       */
      exclude?: ReadonlyArray<string>;
      /**
       * Process only parameters matching the `include` filters.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['QueryParam']
       */
      include?: ReadonlyArray<string>;
    };
    /**
     * Should we preserve the key order when overwriting your input? This
     * option is disabled by default to improve performance.
     *
     * @default false
     */
    preserveOrder?: boolean;
    requestBodies?: {
      /**
       * Prevent request bodies matching the `exclude` filters from being processed.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['Foo']
       */
      exclude?: ReadonlyArray<string>;
      /**
       * Process only request bodies matching the `include` filters.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['Foo']
       */
      include?: ReadonlyArray<string>;
    };
    responses?: {
      /**
       * Prevent responses matching the `exclude` filters from being processed.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['Foo']
       */
      exclude?: ReadonlyArray<string>;
      /**
       * Process only responses matching the `include` filters.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['Foo']
       */
      include?: ReadonlyArray<string>;
    };
    schemas?: {
      /**
       * Prevent schemas matching the `exclude` filters from being processed.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['Foo']
       */
      exclude?: ReadonlyArray<string>;
      /**
       * Process only schemas matching the `include` filters.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['Foo']
       */
      include?: ReadonlyArray<string>;
    };
    tags?: {
      /**
       * Prevent tags matching the `exclude` filters from being processed.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['foo']
       */
      exclude?: ReadonlyArray<string>;
      /**
       * Process only tags matching the `include` filters.
       *
       * In case of conflicts, `exclude` takes precedence over `include`.
       *
       * @example ['foo']
       */
      include?: ReadonlyArray<string>;
    };
  };
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Organization created in Hey API platform.
   */
  organization?: string;
  /**
   * Pagination configuration
   */
  pagination?: {
    /**
     * Array of keywords to be considered as pagination field names.
     * These will be used to detect pagination fields in schemas and parameters.
     *
     * @default ['after', 'before', 'cursor', 'offset', 'page', 'start']
     */
    keywords?: ReadonlyArray<string>;
  };
  /**
   * Path to the OpenAPI specification. This can be either local or remote path.
   * Both JSON and YAML file formats are supported. You can also pass the parsed
   * object directly if you're fetching the file yourself.
   */
  path?:
    | 'https://get.heyapi.dev/<organization>/<project>'
    | (string & {})
    | Record<string, unknown>;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Project created in Hey API platform.
   */
  project?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * If you're tagging your specifications with custom tags, you can use
   * them to filter the results. When you provide multiple tags, only
   * the first match will be returned.
   */
  tags?: ReadonlyArray<string>;

  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Every OpenAPI document contains a required version field. You can
   * use this value to fetch the last uploaded specification matching
   * the value.
   */
  version?: string;
}

export interface UserConfig {
  /**
   * Path to the config file. Set this value if you don't use the default
   * config file name, or it's not located in the project root.
   */
  configFile?: string;
  /**
   * Skip writing files to disk?
   *
   * @default false
   */
  dryRun?: boolean;
  /**
   * Path to the OpenAPI specification. This can be either local or remote path.
   * Both JSON and YAML file formats are supported. You can also pass the parsed
   * object directly if you're fetching the file yourself.
   *
   * Alternatively, you can define a configuration object with more options.
   */
  input:
    | 'https://get.heyapi.dev/<organization>/<project>'
    | (string & {})
    | (Record<string, unknown> & { path?: never })
    | Input;
  /**
   * The relative location of the logs folder
   *
   * @default process.cwd()
   */
  logs?:
    | string
    | {
        /**
         * Whether or not error logs should be written to a file or not
         *
         * @default true
         * */
        file?: boolean;
        /**
         * The logging level to control the verbosity of log output.
         * Determines which messages are logged based on their severity.
         *
         * Available levels (in increasing order of severity):
         * - `trace`: Detailed debug information, primarily for development.
         * - `debug`: Diagnostic information useful during debugging.
         * - `info`: General operational messages that indicate normal application behavior.
         * - `warn`: Potentially problematic situations that require attention.
         * - `error`: Errors that prevent some functionality but do not crash the application.
         * - `fatal`: Critical errors that cause the application to terminate.
         * - `silent`: Disables all logging.
         *
         * Messages with a severity equal to or higher than the specified level will be logged.
         *
         * @default 'info'
         */
        level?:
          | 'debug'
          | 'error'
          | 'fatal'
          | 'info'
          | 'silent'
          | 'trace'
          | 'warn';

        /**
         * The relative location of the logs folder
         *
         * @default process.cwd()
         */
        path?: string;
      };
  /**
   * The relative location of the output folder
   */
  output:
    | string
    | {
        /**
         * Defines casing of the output fields. By default, we preserve `input`
         * values as data transforms incur a performance penalty at runtime.
         *
         * @default undefined
         */
        case?: Exclude<StringCase, 'SCREAMING_SNAKE_CASE'>;
        /**
         * Clean the `output` folder on every run? If disabled, this folder may
         * be used to store additional files. The default option is `true` to
         * reduce the risk of keeping outdated files around when configuration,
         * input, or package version changes.
         *
         * @default true
         */
        clean?: boolean;
        /**
         * Process output folder with formatter?
         *
         * @default false
         */
        format?: Formatters | false;
        /**
         * Should the exports from plugin files be re-exported in the index
         * barrel file? By default, this is enabled and only default plugins
         * are re-exported.
         *
         * @default true
         */
        indexFile?: boolean;
        /**
         * Process output folder with linter?
         *
         * @default false
         */
        lint?: Linters | false;
        /**
         * The relative location of the output folder
         */
        path: string;
        /**
         * Relative or absolute path to the tsconfig file we should use to
         * generate the output. If a path to tsconfig file is not provided, we
         * attempt to find one starting from the location of the
         * `@hey-api/openapi-ts` configuration file and traversing up.
         */
        tsConfigPath?: 'off' | (string & {});
      };
  /**
   * Plugins generate artifacts from `input`. By default, we generate SDK
   * functions and TypeScript interfaces. If you manually define `plugins`,
   * you need to include the default plugins if you wish to use them.
   *
   * @default ['@hey-api/typescript', '@hey-api/sdk']
   */
  plugins?: ReadonlyArray<UserPlugins['name'] | UserPlugins>;
  /**
   * Regenerate the client when the input file changes? You can alternatively
   * pass a numeric value for the interval in ms.
   *
   * @default false
   */
  watch?:
    | boolean
    | number
    | {
        /**
         * Regenerate the client when the input file changes?
         *
         * @default false
         */
        enabled?: boolean;
        /**
         * How often should we attempt to detect the input file change? (in ms)
         *
         * @default 1000
         */
        interval?: number;
        /**
         * How long will we wait before the request times out?
         *
         * @default 60_000
         */
        timeout?: number;
      };

  // DEPRECATED OPTIONS BELOW

  /**
   * @deprecated
   *
   * Manually set base in OpenAPI config instead of inferring from server value
   */
  // eslint-disable-next-line typescript-sort-keys/interface
  base?: string;
  /**
   * @deprecated
   *
   * Opt in to the experimental parser?
   *
   * @default true
   */
  experimentalParser?: boolean;
  /**
   * @deprecated
   *
   * Generate core client classes?
   *
   * @default true
   */
  exportCore?: boolean;
  /**
   * @deprecated
   *
   * Custom client class name. Please note this option is deprecated and
   * will be removed in favor of clients.
   *
   * @link https://heyapi.dev/openapi-ts/migrating.html#deprecated-name
   */
  name?: string;
  /**
   * @deprecated
   *
   * Path to custom request file. Please note this option is deprecated and
   * will be removed in favor of clients.
   *
   * @link https://heyapi.dev/openapi-ts/migrating.html#deprecated-request
   */
  request?: string;
  /**
   * @deprecated
   *
   * Use options or arguments functions. Please note this option is deprecated and
   * will be removed in favor of clients.
   *
   * @link https://heyapi.dev/openapi-ts/migrating.html#deprecated-useoptions
   *
   * @default true
   */
  useOptions?: boolean;
}

export type Config = Omit<
  Required<UserConfig>,
  | 'base'
  | 'input'
  | 'logs'
  | 'name'
  | 'output'
  | 'plugins'
  | 'request'
  | 'watch'
> &
  Pick<UserConfig, 'base' | 'name' | 'request'> & {
    input: Omit<Input, 'path'> & Pick<Required<Input>, 'path'>;
    logs: Extract<Required<UserConfig['logs']>, object>;
    output: Extract<UserConfig['output'], object>;
    pluginOrder: ReadonlyArray<ClientPlugins['name']>;
    plugins: ArrayOfObjectsToObjectMap<
      ExtractArrayOfObjects<ReadonlyArray<ClientPlugins>, { name: string }>,
      'name'
    >;
    watch: Extract<Required<UserConfig['watch']>, object>;
  };
