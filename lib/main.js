'use strict';

const moment = require('moment');

// TODO: run ./query.graphql against GitHub API v4

const response = require('../data');

// week -> user -> number of reviews
const result = {};

// Process GraphQL response and create aggregated data
for (const pr of response.data.repository.pullRequests.edges) {
  const prAuthor = pr.node.author.login;
  for (const rev of pr.node.reviews.edges) {
    const when = rev.node.submittedAt;
    const reviewer = rev.node.author.login;

    if (reviewer === prAuthor) continue;

    const m = moment(when);
    const week = `${m.year()} week ${m.isoWeek()}`;

    if (!result[week]) result[week] = {};
    result[week][reviewer] = (result[week][reviewer] || 0) + 1;
  }
}

// Visualize the data for the last 4 weeks, excluding the current week
const sortedWeeks = Object.keys(result).sort().slice(-5, -1);
for (const week of sortedWeeks) {
  console.log();
  console.log(`**${week}**`);

  const weekData = result[week];
  const sortedReviewers = Object.keys(weekData).sort(
    (a1, a2) => weekData[a2]-weekData[a1]
  );

  for (const reviewer of sortedReviewers) {
    const n = weekData[reviewer];
    console.log(
      reviewer.padStart(20),
      // number of reviews as a number
      String(n).padEnd(3),
      // number of reviews as a bar chart
      ''.padEnd(n, '#')
    );
  }
}
