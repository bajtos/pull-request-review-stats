'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const moment = require('moment');

const userAgent = 'request/' + require('request/package.json').version;
const token = loadAccessToken();


run().catch(err => {
  console.error(err);
  process.exit(1);
});

async function run() {
  console.log('Fetching repository names...');
  const repos = await fetchRepositoryNames(r =>
    /^loopback/.test(r) ||
    r === 'strong-remoting' ||
    r === 'strong-soap' ||
    r === 'loopback.io' ||
    r === 'v4.loopback.io' ||
    r === 'strongloop.com'
  );

  const pullRequests = await fetchPullRequestsWithReviews(repos);

  console.log('Aggregating data...');
  // week -> user -> number of reviews
  const result = {};

  for (const pr of pullRequests) {
    aggregateReviewsOfPullRequest(pr, result);
  }

  console.log('\n==== THE REPORT ====\n\n');
  visualize(result);
}

function loadAccessToken() {
  const tokenFile = path.resolve(__dirname, '../.token.txt');
  try {
    return fs.readFileSync(tokenFile, 'utf-8').trim();
  } catch (err) {
    console.error('Cannot load the access token:', err.message);
    process.exit(1);
  }
}

async function fetchRepositoryNames(filter) {
  const list = [];
  let endCursor = undefined;
  do {
    const data = await executeQuery(buildRepositoryQuery(endCursor));
    const {pageInfo, nodes} = data.organization.repositories;
    list.push(...nodes.map(n => n.name));
    endCursor = pageInfo.hasNextPage ? pageInfo.endCursor : false;
  } while(endCursor);
  return list.filter(filter);
}

function buildRepositoryQuery(afterCursor) {
  const after = afterCursor ? ` after: "${afterCursor}",`: '';

return `{
  organization(login: "strongloop") {
    repositories(first: 100,${after} orderBy: {field: NAME, direction: ASC}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
      }
    }
  }
}`;
}

async function fetchPullRequestsWithReviews(repos) {
  const pullRequests = [];
  let slice = [];
  while (repos.length) {
    slice.push(repos.shift());
    if (slice.length < 5) continue;
    await query();
    slice = [];
  }
  if (slice.length) await query();

  async function query() {
    console.log('Fetching pull request reviews from:', ...slice);
    const q = buildReviewsQuery(slice);
    const result = await executeQuery(q);
    for (const entry in result) {
      pullRequests.push(...result[entry].pullRequests.nodes);
    }
  }
  return pullRequests;
}

function buildReviewsQuery(repos) {
  const entries = repos.map((r, ix) => `
  entry${ix}: repository(owner: "strongloop", name: "${r}") {
    ...pullRequestReviews
  }
`).join('');

  return `{
${entries}
}

fragment pullRequestReviews on Repository {
  pullRequests(last: 100, orderBy: {field: UPDATED_AT, direction: ASC}) {
    nodes {
      url
      author {
        login
      }
      reviews(last: 50) {
        nodes {
          submittedAt
          author {
            login
          }
        }
      }
    }
  }
}
`;
}

async function executeQuery(query) {
  const response = await request({
    method: 'POST',
    url: 'https://api.github.com/graphql',
    json: true,
    headers: {
      'User-Agent': userAgent,
      Authorization: `bearer ${token}`,
    },
    body: {
      query: `query ${query}`
    }
  });
  return response.data;
}

function aggregateReviewsOfPullRequest(pr, result) {
  const prAuthor = pr.author && pr.author.login;
  for (const rev of pr.reviews.nodes) {
    const when = rev.submittedAt;
    const reviewer = rev.author.login;

    if (reviewer === prAuthor) continue;

    const m = moment(when);
    const week = `${m.year()} week ${m.isoWeek()}`;

    if (!result[week]) result[week] = {};
    result[week][reviewer] = (result[week][reviewer] || 0) + 1;
  }
}

// Visualize the data for the last 5 weeks, excluding the current week
function visualize(result) {
  const sortedWeeks = Object.keys(result).sort().slice(-5, -1);
  for (const week of sortedWeeks) {
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

    console.log();
  }
}
