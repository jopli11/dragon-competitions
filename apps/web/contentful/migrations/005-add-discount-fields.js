/**
 * Contentful Migration: Add discount and free-entry controls to raffles
 *
 * Run via:
 *   cd apps/web
 *   CONTENTFUL_MIGRATION_FILE=contentful/migrations/005-add-discount-fields.js node scripts/contentful/migrate.mjs
 */

module.exports = function (migration) {
  const raffle = migration.editContentType("raffle");

  raffle
    .createField("discountActive")
    .name("Discount Active")
    .type("Boolean")
    .required(false)
    .defaultValue({ "en-US": false });

  raffle
    .createField("discountPercent")
    .name("Discount Percent")
    .type("Integer")
    .required(false)
    .defaultValue({ "en-US": 0 })
    .validations([{ range: { min: 0, max: 100 } }]);

  raffle
    .createField("discountLabel")
    .name("Discount Label")
    .type("Symbol")
    .required(false)
    .validations([{ size: { min: 1, max: 40 } }]);

  raffle
    .createField("freeEntryMaxPerUser")
    .name("Free Entry Max Per User")
    .type("Integer")
    .required(false)
    .defaultValue({ "en-US": 1 })
    .validations([{ range: { min: 1 } }]);
};
