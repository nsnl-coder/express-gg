<!-- code file -->

1. Change the auth & check for required fields in routes file
2. Define schema for express, yup
3. Make sure to parse req.body in: create one, update one and update many
4. Make sure to check for existence if req.body contain objectid type
5. Make sure to handle side effect when delete one or delete many

<!-- test file -->

7. if req.body contain objectid, add test to make sure that it will return error
   if objectid does not exist.
