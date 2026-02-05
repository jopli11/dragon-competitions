/**
 * Contentful Migration: Initial schema for Dragon Competitions
 *
 * Usage (via our helper script):
 *   npm run contentful:migrate
 */

module.exports = function (migration) {
  const faqItem = migration
    .createContentType("faqItem")
    .name("FAQ Item")
    .description("Reusable FAQ question/answer block.")
    .displayField("question");

  faqItem
    .createField("question")
    .name("Question")
    .type("Symbol")
    .required(true);

  faqItem
    .createField("answer")
    .name("Answer")
    .type("RichText")
    .required(true);

  const globalSettings = migration
    .createContentType("globalSettings")
    .name("Global Settings")
    .description("Single entry for site-wide settings.")
    .displayField("internalName");

  globalSettings
    .createField("internalName")
    .name("Internal name")
    .type("Symbol")
    .required(true);

  globalSettings
    .createField("supportEmail")
    .name("Support email")
    .type("Symbol")
    .required(false)
    .validations([{ regexp: { pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" } }]);

  globalSettings
    .createField("globalLegalCopy")
    .name("Global legal copy")
    .type("RichText")
    .required(false);

  const raffle = migration
    .createContentType("raffle")
    .name("Raffle")
    .description("A single competition/raffle event.")
    .displayField("title");

  raffle.createField("title").name("Title").type("Symbol").required(true);

  raffle
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([
      { regexp: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
      { unique: true },
    ]);

  raffle
    .createField("status")
    .name("Status")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["draft", "live", "ended"] }]);

  raffle.createField("startAt").name("Start at").type("Date").required(true);
  raffle.createField("endAt").name("End at").type("Date").required(true);

  raffle
    .createField("heroImage")
    .name("Hero image")
    .type("Link")
    .linkType("Asset")
    .required(true);

  raffle
    .createField("galleryImages")
    .name("Gallery images")
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      linkType: "Asset",
      validations: [{ assetImageDimensions: { width: { min: 600 }, height: { min: 400 } } }],
    });

  raffle
    .createField("ticketPricePence")
    .name("Ticket price (pence)")
    .type("Integer")
    .required(true)
    .validations([{ range: { min: 1, max: 1000000 } }]);

  raffle
    .createField("skillQuestion")
    .name("Skill question")
    .type("Symbol")
    .required(true);

  raffle
    .createField("answerOptions")
    .name("Answer options (up to 3)")
    .type("Array")
    .required(true)
    .items({
      type: "Symbol",
      validations: [{ size: { min: 2, max: 80 } }],
    })
    .validations([{ size: { min: 2, max: 3 } }]);

  raffle
    .createField("correctAnswerIndex")
    .name("Correct answer index (0-based)")
    .type("Integer")
    .required(true)
    .validations([{ in: [0, 1, 2] }]);

  raffle
    .createField("raffleDescription")
    .name("Raffle description")
    .type("RichText")
    .required(false);

  raffle
    .createField("prizeDetails")
    .name("Prize details")
    .type("RichText")
    .required(false);

  raffle
    .createField("cashAlternativeEnabled")
    .name("Cash alternative enabled")
    .type("Boolean")
    .required(false);

  raffle
    .createField("cashAlternativeAmountPence")
    .name("Cash alternative amount (pence)")
    .type("Integer")
    .required(false)
    .validations([{ range: { min: 0, max: 100000000 } }]);

  raffle
    .createField("cashAlternativeCopy")
    .name("Cash alternative copy")
    .type("RichText")
    .required(false);

  raffle
    .createField("perRaffleFaqs")
    .name("Per-raffle FAQs")
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["faqItem"] }],
    });

  raffle
    .createField("pricingRules")
    .name("Pricing + rules copy")
    .type("RichText")
    .required(false);

  raffle
    .createField("termsAndConditions")
    .name("Terms and conditions")
    .type("RichText")
    .required(false);
};

