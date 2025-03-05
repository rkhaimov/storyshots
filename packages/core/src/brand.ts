/**
 * Creates a branded type by intersecting a base type with a unique property.
 * This technique, known as "branding," is used to achieve nominal typing in TypeScript,
 * ensuring that even if two types have the same structure, they are not considered interchangeable.
 *
 * @template TType - The base type to be branded.
 * @template TProperty - A string literal representing the unique property for the brand.
 *
 * @example
 * // Define a branded type for UserId
 * type UserId = Brand<number, 'UserId'>;
 * // Define a branded type for ProductId
 * type ProductId = Brand<number, 'ProductId'>;
 *
 * // Function that accepts only UserId
 * function getUserById(id: UserId) {
 *   // Implementation
 * }
 *
 * const userId = 123 as UserId;
 * const productId = 456 as ProductId;
 *
 * getUserById(userId); // Valid
 * getUserById(productId); // Type error: Argument of type 'ProductId' is not assignable to parameter of type 'UserId'.
 */
export type Brand<TType, TProperty extends string> = TType & {
  [Key in `__${TProperty}`]: TProperty;
};

/**
 * Creates a sub-brand from an existing branded type, allowing for hierarchical branding.
 * This is useful when you want to create more specific branded types based on a general branded type.
 *
 * @template TBrand - The existing branded type to extend.
 * @template TProperty - A string literal representing the unique property for the new sub-brand.
 *
 * @example
 * // Define a general branded type for EntityId
 * type EntityId = Brand<number, 'EntityId'>;
 * // Define a sub-brand for UserId based on EntityId
 * type UserId = SubBrand<EntityId, 'UserId'>;
 * // Define a sub-brand for ProductId based on EntityId
 * type ProductId = SubBrand<EntityId, 'ProductId'>;
 *
 * const userId = 123 as UserId;
 * const productId = 456 as ProductId;
 *
 * // Function that accepts any EntityId
 * function getEntityById(id: EntityId) {
 *   // Implementation
 * }
 *
 * getEntityById(userId); // Valid
 * getEntityById(productId); // Valid
 *
 * // Function that accepts only UserId
 * function getUserById(id: UserId) {
 *   // Implementation
 * }
 *
 * getUserById(userId); // Valid
 * getUserById(productId); // Type error: Argument of type 'ProductId' is not assignable to parameter of type 'UserId'.
 */
export type SubBrand<
  TBrand extends Brand<unknown, never>,
  TProperty extends string,
> = Brand<TBrand, TProperty>;
