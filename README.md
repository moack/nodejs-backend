# Backend Unicorn Thrift Store

## Design Decissions
- MySQL as a Database: Persistent solid ACID database.
- Repository Pattern implemented, so we can always change our data layer in case of a different database.
- Jest for unit-testing framework.
- N-Tier Architecture, plain and simple, since we don't have a big IT landscape yet, if it gets bigger (more microservices): DDD architecture is recommended.
- zod for Validation of Datamodels, compact and easy to use.
- Since the microservice is currently small, we keep Product and Authentication/User logic in one project, but if it grows they need their own Microservices.
- Tripple AAA pattern for Unit-testing.
- supertest for routing tests.

# Unicorn Backend

![CI](https://github.com/moack/unicorn-backend/actions/workflows/CI.yml/badge.svg)

[![codecov](https://codecov.io/gh/moack/unicorn-backend/branch/main/graph/badge.svg)](https://codecov.io/gh/moack/unicorn-backend)

