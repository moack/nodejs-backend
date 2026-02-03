# Backend Unicorn Thrift Store

This is the NodeJS backend for the `The Magical Unicorn Thrift Store`-project.

## Design Decissions
- MySQL as a Database: Persistent solid ACID database.
- Repository Pattern implemented, so we can always change our data layer in case of a different database.
- Jest for unit-testing framework.
- N-Tier Architecture, plain and simple, since we don't have a big IT landscape yet, if it gets bigger (more microservices): DDD architecture is recommended.
- zod for Validation of Datamodels, compact and easy to use.
- Since the microservice is currently small, we keep Product and Authentication/User logic in one project, but if it grows they need their own Microservices.
- Tripple AAA pattern for Unit-testing.
- supertest for routing tests.
- Multistage pipeline
- Matrix Strategy pattern
- ExpressJS as webserver to host API
- JWT Tokens for authentication with cookie (XSS protection and needs CORS) and we don't use non-browsers to communicate with this service.
  Configure frontend with: Httponly, samesite=lax, secure and setup CORS here to prevent 

## Status

![CI](https://github.com/moack/nodejs-backend/actions/workflows/ci.yml/badge.svg?branch=main)

[![codecov](https://codecov.io/gh/moack/nodejs-backend/branch/main/graph/badge.svg)](https://codecov.io/gh/moack/nodejs-backend)

