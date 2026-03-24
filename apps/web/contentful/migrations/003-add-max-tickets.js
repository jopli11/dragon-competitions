module.exports = function (migration) {
  const raffle = migration.editContentType("raffle");
  
  raffle
    .createField("maxTickets")
    .name("Maximum Tickets")
    .type("Integer")
    .required(true)
    .defaultValue({ "en-US": 5000 })
    .validations([
      {
        range: {
          min: 1,
        },
      },
    ]);
};
