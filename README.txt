Dev Partner Web App


Technologies Used
-----------------


* Node JS, Express JS for server
* Javascript, CSS, Jade for browser
* MongoDB and Mongoose for Database
* JQuery Data Table Library for Data Tables
* Google Charts for Line Charts
* Bootstrap for website layout 


How the Dev Partner Web App Works
---------------------------------


1. Create User
   - Uses form validation to not allow duplicate users, blank usernames/passwords
   - Password fields highlight red if password and confirm password do not match (highlight green if they do match)
   - Upon creation, username and MD5 Hash encrypted password are added to the database
2. Login
   - Uses form validation to only allow users that enter correct username and password
   - Entered password is encrypted and checked against password for entered user
3. Admin Page
   - Login as user
      * Admin can enter any username and login as that user
      * Uses form validation to only work with valid usernames
   - Re-Queue all Data to be Processed
      * Takes all original data in the database
      * Re-sends all original data to the work processor to be processed
4. User Page
   - Browse Button
      * Opens File Dialogue for user to select .csv file they want to upload
   - Upload Button
      * Parses selected data file
      * Saves unprocessed data to database
      * Sends unprocessed data to work processor to be processed in some way
   - File Link
      * Link only works when data from uploaded file is completely processed by work processor and is ready
      * Takes user to CSV Chart/Graph Page
   - Settings Button
       * Opens settings menu
       * Change Password
       * Delete User
   - Logout Button
      * Sends user to home login page
5. Database
   - How information is stored in the database
      * User =({ username, MD5 Hash Encrypted password, data: [UserData] })
      * UserData =({ filename, date uploaded, unprocessed data ID, processed data ID, status })
      * UnprocessedData =({ unprocessed data })
      * ProcessedData =({ processed data })
      * Status can be uploading, in queue, processing, and ready
      * unprocessed data ID is an ID tag that references a user’s unprocessed file data within another collection in the database (dataCollection)
      * processed data ID is an ID tag that references a user’s processed file data within another collection in the database (processedDataCollection)
      * Users exist within the userCollection in the database
6. Work Processor
   - Receives unprocessed data sent from Dev Partner Web App
   - Manipulates data using a function passed in by whoever is doing the external processing
   - Sends manipulated data back to the database
7. CSV Chart/Graph Page
   - Uses JQuery Data Table Library to display uploaded and processed data in a multi-functional table view
   - Uses Google Charts to display uploaded and processed data as a simple line graph
   - Back button
      * Routes user back to their user page
   - Logout button
      * Routes user back to home login page