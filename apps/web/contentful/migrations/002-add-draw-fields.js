/**
 * Contentful Migration: Add drawType and isReoccurring to Raffle content type
 */

module.exports = function (migration) {
  const raffle = migration.editContentType("raffle");

  raffle
    .createField("drawType")
    .name("Draw Type")
    .type("Symbol")
    .required(false)
    .validations([{ in: ["auto", "live"] }])
    .defaultValue({ "en-US": "auto" });

  raffle
    .createField("isReoccurring")
    .name("Is Reoccurring")
    .type("Boolean")
    .required(false)
    .defaultValue({ "en-US": false });
};
