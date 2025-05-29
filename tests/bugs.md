# Issues with sdet-takehome

- Long Notes Overflow: Notes exceeding a certain character limit do not display properly within the container.Consider enforcing a character limit or implementing an expandable view to handle longer text gracefully.

- UI State After Deletion: When all interactions are deleted from the UI, the details of the last deleted interaction remain visible until the page is refreshed. This can cause confusion and should be cleared immediately upon deletion.

- Self-Referencing Interactions: A source contact is able to create an interaction with themselves by selecting their own name from the target contact list. The target dropdown should exclude the selected source contact to prevent this scenario.

- Undefined ID in DELETE Request: Sending a DELETE request to /api/interaction/undefined breaks the application. The API should validate the ID parameter and return a proper error response when the ID is missing or malformed.

- Invalid ID Handling in Payload: Providing an invalid ID (e.g., a number instead of a string) in the request payload for creating an interaction results in a failure. Input validation should be added to handle such cases gracefully.

- Radio Button State Issue: When a radio button is selected, the checked attribute is not correctly reflected in the DOM. This can lead to issues in both functionality and test reliability and should be corrected to maintain expected HTML behavior.
