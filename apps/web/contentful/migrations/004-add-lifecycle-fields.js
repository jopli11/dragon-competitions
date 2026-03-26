/**
 * Contentful Migration: Add lifecycle fields for raffle automation
 *
 * - Adds "awaitingDraw" to the status validation
 * - Adds winner display fields (winnerDisplayName, winnerTicketNumber, drawDate)
 *
 * Run via:
 *   cd apps/web
 *   CONTENTFUL_MIGRATION_FILE=contentful/migrations/004-add-lifecycle-fields.js node scripts/contentful/migrate.mjs
 */

module.exports = function (migration) {
  const raffle = migration.editContentType("raffle");

  raffle.editField("status").validations([
    { in: ["draft", "live", "awaitingDraw", "ended"] },
  ]);

  raffle
    .createField("winnerDisplayName")
    .name("Winner Display Name")
    .type("Symbol")
    .required(false);

  raffle
    .createField("winnerTicketNumber")
    .name("Winner Ticket Number")
    .type("Integer")
    .required(false);

  raffle
    .createField("drawDate")
    .name("Draw Date")
    .type("Date")
    .required(false);
};
