// TypeScript Does not allow custom error on type errors. This is a hackish work around.
type NotAnRQLStringError =
  'Please use rqlBuilder to construct valid RQL. See README for an example.';
type RQLCheck<T> = T extends any ? NotAnRQLStringError : T;
export type RQLString = RQLCheck<string>;

type RQLBuilderString = RQLString | string;
export type RQLBuilderOptions = {
  // Overrides the global `rqlBuilder.doubleEncodeValues` value for this rql builder (Default true).
  doubleEncodeValues?: boolean;
  rql?: RQLBuilderString;
};
export type RQLBuilderInput = RQLBuilderString | RQLBuilderOptions;

export interface RqlBuilderFactory {
  /**
   * @deprecated this property is only meant to be used for backwards compatibility when upgrading to v8.0.0
   *
   * **Previous behaviour:**
   * - RQL values could be provided as double encoded to an rql builder
   * - `rqlBuilder.doubleEncodeValues` could be set to `true` to enable double encoding of values for all rql builders
   * - `rqlBuilder({ doubleEncodeValues: true })...` could enable automatic double encoding of values for an rql builder
   *
   *
   * **New behaviour:**
   * - RQL values are automatically double encoded when using an rql builder
   *
   * **How to upgrade to 8.0.0:**
   * - Update any RQL values to no longer be encoded manually or using methods such as `encodeURIComponent()`
   * - old value: 'Hypertension%2520%252D%2520STAGE%25201'
   * - new value: 'Hypertension - STAGE 1'
   *
   * **Alternatively**:
   * - `rqlBuilder.doubleEncodeValues` can be set to `false` to disable double encoding of values for all rql builders
   * - `rqlBuilder({ doubleEncodeValues: true })...` enables automatic double encoding of values for an rql builder
   *
   */
  doubleEncodeValues?: boolean;
  (input?: RQLBuilderInput): RQLBuilder;
}

export interface RQLBuilder {
  /**
   * Trims each object down to the set of properties defined in the arguments
   * - Only return field1 and field2 from the records: select(field1, field2)
   */
  select: (fields: string | string[]) => RQLBuilder;

  /**
   * - Only return 1 record: limit(1)
   * - Only return 10 records and skip the first 50: limit(10, 50)
   */
  limit: (limit: number, offset?: number) => RQLBuilder;

  /**
   * Sorts by the given property in order specified by the prefix
   * - \+ for ascending
   * - \- for descending
   */
  sort: (fields: string | string[]) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is not in the provided array
   */
  out: (field: string, values: string[]) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is in the provided array
   */
  in: (field: string, values: string[]) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is greater than or equal to the provided value
   */
  ge: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is equal to the provided value
   */
  eq: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is less than or equal to the provided value
   */
  le: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is not equal to the provided value
   */
  ne: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified string field contains the substring provided in the value.
   */
  like: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is less than the provided value
   */
  lt: (field: string, value: string) => RQLBuilder;

  /**
   * Filters for objects where the specified property's value is greater than the provided value
   */
  gt: (field: string, value: string) => RQLBuilder;

  /**
   * Allows combining results of 2 or more queries with the logical AND operator.
   */
  and: (...conditions: RQLString[]) => RQLBuilder;

  /**
   * Allows combining results of 2 or more queries with the logical OR operator.
   */
  or: (...conditions: RQLString[]) => RQLBuilder;
  /**
   * @description `contains(field)` only returns records having this field as property
   * @example
   * await exh.data.documents.find(
   *   schemaId,
   *   { rql: rqlBuilder().contains('data.indicator').build()
   * });
   * @returns returns documents containing the `data.indicator` field
   *
   * @description Filters for objects where the specified property's value is an array and the array contains
   * any value that equals the provided value or satisfies the provided condition.
   * `contains(field, itemField > 30)` only returns records having a property `field` which have a prop `itemField` for which the condition is valid
   * `contains` with a single property is not strictly needed. This can be replaced with `gt(field.itemField,30)`.
   * @example
   * await exh.data.documents.find(schemaId, {
   *   rql: rqlBuilder()
   *         .contains(
   *              "data",
   *              rqlBuilder().gt("heartrate", "60").intermediate(),
   *                rqlBuilder().lt("heartrate", "90").intermediate()
   *          )
   *          .build();
   * });
   * @return Only returns documents with a data object containing `heartrate > 60` and `heartrate > 90`
   */
  contains: (field: string, ...conditions: RQLString[]) => RQLBuilder;
  /**
   * @description `excludes(field)` only returns records not having this field as property
   * @example
   * await exh.data.documents.find(
   *   schemaId,
   *   { rql: rqlBuilder().excludes('data.indicator').build()
   * });
   * @returns returns documents not containing the `data.indicator` field
   *
   * @description Filters for objects where the specified property's value is an array and the array excludes
   * any value that equals the provided value or satisfies the provided condition.
   * `excludes(field, itemField > 30)` only returns records having a property `field` which have a prop `itemField` for which the condition is invalid
   * @example
   * await exh.data.documents.find(schemaId, {
   *   rql: rqlBuilder()
   *     .excludes("data", rqlBuilder().gt("heartrate", "60").intermediate())
   *     .build(),
   * });
   * @return Only returns documents excluding documents where `data.heartrate > 60`
   */
  excludes: (field: string, ...conditions: RQLString[]) => RQLBuilder;

  /**
   * @description skipCount() Skips the record counting step of a request to increase performance.
   *
   * As a result, the page object in a response will not include the total field.
   *
   * @example
   * await exh.data.documents.find(schemaId, {
   *   rql: rqlBuilder()
   *          .skipCount()
   *          .build(),
   * });
   */
  skipCount: () => RQLBuilder;

  /**
   * Returns a valid rqlString
   * @returns valid rqlString
   */
  build: () => RQLString;

  /**
   * Returns an intermediate rqlString you can combine in or/and statements
   * @returns valid rqlString
   */
  intermediate: () => RQLString;
}
