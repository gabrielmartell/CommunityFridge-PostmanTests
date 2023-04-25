Name: Gabriel Martell
Student ID: 101191857

--------------------------------------------------
*2023/04/25
I'm writing this just as a warning that I did do this two years ago. Things might lack efficiency or simplicity, but it worked.
The grade I achieved on this assignment was 100%. This README will be a combination of all assignments prior to this, with a total of 4.
--------------------------------------------------

CONTAINS:
This zip file contains config.js, fridge-router.js and server.js, which reflect the assignment the most.
The "models" folder are also prominent to this program, containing all the nesscecary Mongoose schemes for the Mongo Database.
The "data" folder is not the main focus of the program - although it contains information and data in JSON files for local testing, opposed to server.

The "postman_tests.txt" are my own personal tests for each subsection of the program - these tests primairly test validity in success cases, although failure cases are still proper.

Contents such as "package-lock.json", "package.json" and the folder "node_modules" can be ignored.

INSTRUCTIONS:
Install all prominent extensions (MongoDB, Mongoose, Express) if not done so.

Type "node server.js" (without quotation marks) in the terminal to run the server needed for the program, the server is now connected to the local host, as well as MongoDB's cluster/database.
via Postman, the user can test each GET, PUT, POST and DELETE.

The exisiting requests are:
    GET: http://localhost:8000/fridges                      [CONTENT-TYPE: application/json]
    GET: http://localhost:8000/fridges/fg-#
    GET: http://localhost:8000/search/items?type=&name=     [QUERY REQUIRED]
    PUT: http://localhost:8000/fridges/fg-#                 [FRIDGE BODY REQUIRED]
    PUT: http://localhost:8000/fridges/fg-#/items/#         [QUANTITY & ID BODY REQUIRED]
    POST: http://localhost:8000/fridges                     [FRIDGE BODY REQUIRED]
    POST: http://localhost:8000/fridges/fg-#/items          [QUANTITY & ID BODY REQUIRED]
    POST: http://localhost:8000/items                       [ITEM BODY REQUIRED]
    DELETE: http://localhost:8000/fridges/fg-#/items/#
    DELETE: http://localhost:8000/fridges/fg-#/items?       [QUERY REQUIRED]

Feel free to use my "postman_tests.txt" as a reference or guide.
