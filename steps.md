<!-- code file -->

0. thinking about requirements and list down
1. Change the auth & check for required fields in routes file
2. Define schema for express, yup
3. Make sure to parse req.body in: create one, update one and update many
4. checkForExistence + failed if not exist
5. handle field existed when update unique
6. Make sure to handle side effect when delete one or delete many

<!-- test file -->

5. auth check
6. define valid data with all fields
7. data validation
8. checkIdExistence
9. check for skipped/failed tests
10. handle side-effect of delete, create

642b8200fc13ae1d48f4cf1d
642b8200fc13ae1d48f4cf1e
642b8200fc13ae1d48f4cf1f
642b8200fc13ae1d48f4cf20
642b8200fc13ae1d48f4cf21

After finish all project:

- Check for checkIdExitence in all place
- implement virtual population
