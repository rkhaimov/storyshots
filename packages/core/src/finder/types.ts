import type { Page } from 'playwright';

/**
 * A `Finder` represents a chainable API for locating and interacting with elements on a web page.
 * It allows you to find elements using various criteria such as role, text, label, placeholder, and more.
 *
 * @see https://playwright.dev/docs/api/class-locator
 *
 * @example
 * actor.click(finder.getByRole('button').first())
 */
export type Finder = {
  /**
   * Locates an element by its role.
   *
   * @param role - The role of the element to find (e.g., 'button', 'link').
   * @param options - Additional options to customize the search.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-get-by-role
   * @example
   * finder.getByRole('link', { name: 'Home' }) // <a href="/">Home</a>
   */
  getByRole(role: ByRole['role'], options?: ByRoleOptions): Finder;

  /**
   * Locates an element by its visible text.
   *
   * @param text - The text to match.
   * @param options - Additional options for text matching.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-get-by-text
   * @example
   * finder.getByText('Submit') // <button>Submit</button>
   */
  getByText(text: TextMatch, options?: ByText['options']): Finder;

  /**
   * Locates an element by its label text.
   * This method is commonly used for form elements, where labels are associated with inputs via the `for` attribute.
   *
   * @param text - The label text to match.
   * @param options - Additional options for label text matching.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-get-by-label
   * @example
   * // Fills the input element associated with the label "Username" with the value "John Doe"
   * actor.fill(finder.getByLabel('Username'), 'John Doe')
   * // <label for="username">Username</label>
   * // <input id="username" type="text" />
   */
  getByLabel(text: TextMatch, options?: ByLabel['options']): Finder;

  /**
   * Locates an element by its placeholder text.
   *
   * @param text - The placeholder text to match.
   * @param options - Additional options for placeholder text matching.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-get-by-placeholder
   * @example
   * finder.getByPlaceholder('Enter your name') // <input placeholder="Enter your name">
   */
  getByPlaceholder(text: TextMatch, options?: ByPlaceholder['options']): Finder;

  /**
   * Locates an element by its alt text (used for images or other media).
   *
   * @param text - The alt text to match.
   * @param options - Additional options for alt text matching.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-get-by-alt-text
   * @example
   * finder.getByAltText('Profile picture') // <img alt="Profile picture">
   */
  getByAltText(text: TextMatch, options?: ByAltText['options']): Finder;

  /**
   * Locates an element by its title attribute.
   *
   * @param text - The title text to match.
   * @param options - Additional options for title text matching.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-get-by-title
   * @example
   * finder.getByTitle('Settings') // <div title="Settings"></div>
   */
  getByTitle(text: TextMatch, options?: ByTitle['options']): Finder;

  /**
   * Locates an element by its selector.
   * Supports multiple selector types, such as CSS selectors and XPath expressions.
   *
   * @param selector - The selector to locate the element.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-locator
   * @example
   * // Using a CSS selector to locate an element with the class 'header-title'
   * finder.locator('.header-title') // <h1 class="header-title">Welcome</h1>
   *
   * // Using an XPath expression to locate a button with the text 'Submit'
   * finder.locator('//button[text()="Submit"]') // <button>Submit</button>
   */
  locator(selector: string): Finder;

  /**
   * Filters the current set of matched elements based on provided options.
   *
   * @param options - The filtering options to apply.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-filter
   * @example
   * // Example where filter is used to select a parent element based on the text content of a child element
   * finder.locator('div').filter({ hasText: 'Product 2' }).getByRole('button');
   *
   * // Example HTML structure:
   * // <div>
   * //   <p>Product 1</p>
   * //   <button>Add to Cart</button>
   * // </div>
   * // <div>
   * //   <p>Product 2</p>
   * //   <button>Add to Cart</button>
   * // </div>
   * // <div>
   * //   <p>Product 3</p>
   * //   <button>Add to Cart</button>
   * // </div>
   *
   * // Explanation:
   * // 1. We locate all <div> elements, and then filter them to select the one containing the <p> element with the text 'Product 2'.
   * // 2. After filtering, we chain the call to locate the 'Add to Cart' button within the matching parent <div>.
   * // 3. Finally, we can interact with the 'Add to Cart' button for 'Product 2'.
   */
  filter(options: WithFilterOptions): Finder;

  /**
   * Locates the nth element from the matched set of elements.
   *
   * @param index - The index of the element to locate (0-based).
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-nth
   * @example
   * // Selecting the third item in a list
   * finder.locator('li').nth(2);
   *
   * // Example HTML structure:
   * // <ul>
   * //   <li>First Item</li>
   * //   <li>Second Item</li>
   * //   <li>Third Item</li>  <-- Matched element
   * //   <li>Fourth Item</li>
   * //   <li>Fifth Item</li>
   * // </ul>
   */
  nth(index: number): Finder;

  /**
   * Locates the first element from the matched set of elements.
   *
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-first
   * @example
   * finder.first()
   */
  first(): Finder;

  /**
   * Locates the last element from the matched set of elements.
   *
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-last
   * @example
   * finder.last()
   */
  last(): Finder;

  /**
   * Combines multiple locators using a logical AND operator.
   * This allows for selecting an element that satisfies multiple conditions simultaneously.
   *
   * @param selector - The second locator to combine with the first.
   * @returns A new Finder instance for further chaining.
   * @see https://playwright.dev/docs/api/class-locator#locator-and
   * @example
   * // Selecting an <a> tag that is both a link and contains specific text
   * finder.locator('a').and(finder.getByText('Profile'));
   *
   * // Example HTML structure:
   * // <nav>
   * //   <a href="/home">Home</a>
   * //   <a href="/profile">Profile</a>  <-- Matched element
   * //   <a href="/settings">Settings</a>
   * // </nav>
   */
  and(selector: Finder): Finder;

  /**
   * Allows composing complex selectors by applying a transformer function.
   *
   * @param transformer - A function that transforms the current finder.
   * @returns A new Finder instance for further chaining.
   * @example
   * function byButtonSeverity(severity: string): FinderTransformer {
   *     return (finder) => finder.get('button').filter({ hasText: severity })
   * }
   *
   * finder.get(byButtonSeverity('error')) // <button class="error">Error</button>
   */
  get(transformer: FinderTransformer): Finder;

  /**
   * Converts the current Finder instance into metadata.
   *
   * This method is used internally to generate metadata from a Finder instance.
   * It is not intended for direct use by consumers of the API.
   *
   * @private
   * @returns The Finder metadata.
   */
  __toMeta(): FinderMeta;
};

export type FinderTransformer = (finder: Finder) => Finder;

export type FinderMeta = {
  beginning: ByLocator;
  consequent: Array<ByLocator | ByIndex | WithFilter | WithAnd>;
};

export type ByLocator = {
  type: 'locator';
  by:
    | ByRole
    | ByText
    | ByLabel
    | ByPlaceholder
    | ByAltText
    | ByTitle
    | BySelector;
};

type ByRoleOptions = Parameters<Page['getByRole']>[1];

export type ByRole = {
  type: 'role';
  role: Parameters<Page['getByRole']>[0];
  options: ByRoleOptions;
};

export type ByText = { type: 'text' } & ByTextLike;

export type ByLabel = { type: 'label' } & ByTextLike;

export type ByPlaceholder = { type: 'placeholder' } & ByTextLike;

export type ByAltText = { type: 'alt-text' } & ByTextLike;

export type ByTitle = { type: 'title' } & ByTextLike;

type ByTextLike = {
  text: TextMatch;
  options?: { exact?: boolean };
};

export type BySelector = {
  type: 'selector';
  selector: string;
};

export type WithAnd = {
  type: 'and';
  condition: FinderMeta;
};

type WithFilterOptions = {
  has?: Finder;
  hasNot?: Finder;
  hasText?: TextMatch;
  hasNotText?: TextMatch;
};

export type WithFilter = {
  type: 'filter';
  options: {
    has?: FinderMeta;
    hasNot?: FinderMeta;
    hasText?: TextMatch;
    hasNotText?: TextMatch;
  };
};

export type ByIndex = {
  type: 'index';
  options:
    | {
        kind: 'first';
      }
    | {
        kind: 'last';
      }
    | {
        kind: 'nth';
        at: number;
      };
};

export type TextMatch = string | RegExp;
