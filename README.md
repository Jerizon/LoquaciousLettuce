# Project Name

TESSELL8 is a Guitar-Hero-style game which uses the player's computer's keyboard as the input controller. As the music begins, object descend from the top of the game field to the bottom in four columns. The challenge is to hit the key corresponding to the column at the same moment the object intersects the line at the bottom. Ideally, these intersections should occur at the same moment that the players hear a beat in the music, so that they can use the music to help guide their timing, and to create an enjoyable, rhythmic music experience.

## Team

- Julia Wong
- Kevin Liu
- Kurt Larson
- Jesse Reyes

## Roadmap

View the project roadmap (https://docs.google.com/document/d/1prrXn4fHeLL_dUSxXDWNbhA-Cax1CoZ1z3pSbSNXtkY/edit?usp=sharing)

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

This game is for education and entertainment purposes.

To play TESSEL8, you must register, and, subsequently, log in. After doing that, simply follow the on-screen instructions. 

You can use your own choice of music! Follow the prompts to select a song from Spotify and it will play in the background while you play the game.

From your player-profile page, you can see the scores of the games you have played, filtered by song and difficulty-level.

## Requirements

 - Node
 - Redis
 - Postgresql
 - axios
 - bluebird
 - body-parser
 - bookshelf
 - bootstrap
 - connect-flash
 - connect-redis
 - cookie-parser
 - ejs
 - express
 - jquery
 - keyboardjs
 - knex
 - morgan
 - passport-spotify
 - pg
 - querystring
 - react
 - react-addons-css-transition-group
 - react-audio-player
 - react-bootstrap
 - react-dom
 - react-music-player
 - react-redux
 - react-router
 - react-router-dom
 - react-router-page-transition
 - react-sound
 - redis
 - redux
 - redux-promise
 - redux-thunk
 - request
 - save


## Development

### Installing System Dependencies

```
brew install yarn
brew install redis
brew install postgresql
```

### Install Project Dependencies

```
yarn global add grunt-cli knex eslint
```

## App Configuration

Override settings `config/default.json` in any environment by making a copy of `config/ENV.example.json` and naming it `config/ENV.json` and setting the appropriate variable. 

For environments that require use of environment variables, you can supply variables as defined in `config/custom-environment-variables.json`.

See https://www.npmjs.com/package/config
And https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables

## Database Initialization

IMPORTANT: ensure `postgres` is running before performing these steps.

### Database Creation:

Use grunt to create a new database for your development and test environments:

Development envronment: `grunt pgcreatedb:default`

Other environments, specify like so: `NODE_ENV=test grunt pgcreatedb:default`

### Run Migrations & Data Seeds

In terminal, from the root directory:

To migrate to the latest version, run:

`knex migrate:latest --env NODE_ENV`

To rollback a version, run:

`knex migrate:rollback --env NODE_ENV`

To populate the database with seed data, run:

`knex seed:run --env NODE_ENV`

Note: `--env NODE_ENV` may be omitted for development. For example, `knex migrate:latest` will run all migrations in the development environment, while `knex migrate:latest --env test` will migrate in the test environment.

## Running the App

To run webpack build: `yarn run build`

To run server: `yarn run start`

To run tests: `yarn run test`

To run your redis server for the session store `redis-server`
