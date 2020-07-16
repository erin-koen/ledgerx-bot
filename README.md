# ledger-x-bot

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> A twitter bot that queries ledger x for daily volume data, saves it, and posts it.

Ledger X is regulated in the United States as a Swap Execution Facility, and therefore posts daily reports of volume in all products it trades. This program pulls that data from a publically available endpoint, parses it, sticks it into a postgres database. It then tweets out data points on a regular cadence. 

## Table of Contents

- [Install](#install)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

> You shouldn't run this locally, because we'll be posting the same things. But if you wanted to:

- [ ] Fork if you'd like
- [ ] Clone
- [ ] `npm install` or `yarn install`
- [ ] Configure a .env file as per .env.example
- [ ] `npm serve`

## Database

The postgres database is managed using [knex](http://knexjs.org/). The migrations are written, and need to be run. If you're deploying to a cloud service (I used heroku), you'll have to provision a postgres db then store the DATABASE_URL as an environment variable. Once that's done, you can run `knex migrate:latest` to run the migrations and you should be good to go.

## General Thoughts and Notes

- There's one quirk to deployment - you'll need to run a function called `addLedgerX` after running the migrations. It's in the `./helpers` directory. Contract records have a foreign key reference to exchange records so the functions that add them to the tables will fail if there's not a corresponding exchange. My plan was to build this into the start script but I never got around for it. When I deployed, I just called the function manually from the heroku cli.
- I initially planned on using this project to mess around with Amazon Lambda functions (or similar) for the scrape and tweet functions. I'd fire the function on a schedule, scrape, parse, and send the result off to an endpoint to store in the database. I never actually deployed this version, and got a job so stopped working on it. 
- Endpoints are hardcoded, sorry about that. They aren't referenced all that frequently (just in the files in the helpers director) so will be easy to refactor into an environment variable.
- Tests are non-existent. Again, I started them, but got a job and never revisited. 

## API


**Method**|**Endpoint**|**Access Control**|**Description**
-----|-----|-----|-----
POST|`contracts/`|None, pending|Adds an array of contract objects to the db
GET|`contracts/options/greatest/:date`|None, pending|Returns the most active contract on a given date
GET|`contracts/opttions/sum/:date`|None, pending|Returns an object with total number of options contracts traded on a given date
GET|`contracts/opions/expiring/:date`|None, pending|Returns an array of options objects that have non-zero open interest that are expiring on a given date



