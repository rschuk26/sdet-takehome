# This document outlines the strategy for testing interactions full-stack component that allows user to:
- View a list of interactions between people
- Create new interactions
- Delete existing interactions
- View details of a selected interaction

# What will be automated vs tested manually:
- API endpoints:
    - all of them should be automated covering positive scenarios with various data sets (not hardcoded)
    - negative scenarios with empty fields, prohibited values, bull values, missing fields and incorrect object sent
- Frontend UI:
    - component rendering and form validation - need to be automated
    - visual layout and navigation - manual
- E2E flow integration:
    - user flows from create/view/delete interaction in UI with backend checks - need to be automated

# Additional types of Testing:
- Performance Testing:
    - test backend response times for different methods and endpoints
    - various types of load testing
- Security Testing:
    - to prevent SQL injection
- Accessibility Testing:
    - to validate WCAG compliance
    - tools like AXE can be integrated into the framework if needed
- Database testing:
    - schema validations

# Test Data strategy:
1. Factory based data generation: use custom data builders for unique test data
2. Seed test data into DB with before and after clean-up hooks
3. Each of the tests should use a unique data set

# Improvements suggestions:
- API:
    - handling of invalid values
    - authentication
- Overall:
    - add capability to create/remove contact

# CI/CD:
- Run linting, tests and coverage on PR