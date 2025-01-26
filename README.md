# Quotilate

Quotilate is a simple and engaging web application that provides users with random quotes.
With an intuitive interface, users can discover, share, and copy their favorite quotes. What is more is that you can even save your favourite quote for later use.
Quotilate is designed to be responsive, allowing users to access it on both desktop and mobile devices seamlessly.


## Table of Contents
- Features
- Demo
- Installation
- Usage
- API


## Features
1. Display random quotes from a database which is populated by a third-party API.
2. A new quote can be generated with the click of a button or by refreshing the page.
3. User-friendly interface for a smooth experience.
4. Option to share or copy quotes directly from the application.
5. Registered users can save their favourite quotes for future use.
6. Responsive design for optimal viewing on various devices.


## Demo
You can try out Quotilate live here: [quotilate](https://quotilate.heroku.com)


## Installation
To run Quotilate locally, simply follow these steps:

1. Clone the repository
```
git clone https://github.com/Antoniomary/quotilate.git
cd quotilate
```

2. Run the script
```
./setup.sh
```

3. Open in this url in browser `http://localhost:8000`.


### Prerequisites
The following need to be installed:
1. Mongo server
2. Redis server
3. Node.js
4. npm



## Usage
Upon opening the application, users will be presented with a random quote. Users can:

Click the `Generate quote` button to fetch a new random quote.
You can copy the quote to the clipboard with the `Copy` button.
Or you can share it directly to your social media with the `Share` button.
Or you can save it if you have an account with the `Save` button.
If you are not inspired by what you see. Just use the `Generate quote` button again, on and on.


## API

### POST /register

#### Description
creates a new user

#### Request
- **Headers**: Use the `Accept` header set to `application/json` to get a JSON response else None.
- **URL parameters**: None.
- **Body Parameters**: This endpoint requires a JSON body with the following fields:

  | Parameter    | Type     | Required | Description                                      |
  |--------------|----------|----------|--------------------------------------------------|
  | `username`   | String   | Yes      | The username of the user (must be unique).       |
  | `email`      | String   | Yes      | The user’s email address (must be unique).       |
  | `password`   | String   | Yes      | The user’s password.                             |
  | `repassword` | String   | Yes      | The user's password again (must match password). |

	- **Example of JSON Body**:
        ```json
        {
          "username": "johndoe",
	      "email": "johndoe@example.com",
    	  "password": "strongpassword123",
    	  "rePassword": "strongpassword123"
    	}
  	    ```

#### Response
By default, this endpoint returns a HTML file.
- for example
	- ```
	    <!DOCTYPE html>
	    <html>
	      ...
	    </html>
	  ```
You can get a JSON response by using the Accept header appropriately.
- For example
	- ```
	  {
  	    "id": "1234567890",
	    "username:: "johndoe",
	    "createdAt": 2024-11-15T04:31:53.504Z
	  }
	  ```
- **Status code**:
	- 201 OK
	- 400 BAD REQUEST 
	- 500 
	- 403 Unauthorized


### POST /login

#### Description
logins in an existing user

#### Request
- **Headers**: Use the `Accept` header set to `application/json` to get a JSON response else None.
- **URL parameters**: None.
- **Body Parameters**: This endpoint requires a JSON body with the following fields:

  | Parameter            | Type     | Required | Description                        |
  |----------------------|----------|----------|------------------------------------|
  | `username or email`  | String   | Yes      | The username or email of the user. |
  | `password`           | String   | Yes      | The user’s password.               |

	- **Example of JSON Body**:
        ```json
        {
          "username": "johndoe",
    	  "password": "strongpassword123",
  	}
	or
        {
	  "email": "johndoe@example.com",
    	  "password": "strongpassword123",
  	}
  	```
#### Response
By default, this endpoint returns a HTML file.
- for example
	- ```
	    <!DOCTYPE html>
	    <html>
	      ...
	    </html>
	  ```
You can get a JSON response by using the Accept header appropriately.
- For example
	- ```
	  {
  	    "id": "1234567890",
	    "username": "johndoe",
	    "email": "johndoe@example.com",
	    "quotes": [],
	    "numberOfQuotes": 0,
	    "createdAt": 2024-11-15T04:31:53.504Z
	    "lastLogin": 2024-11-15T05:31:53.504Z
	  }
	  ```
- **Status code**:
	- 201 OK
	- 400 
	- 500 
	- 000 Unauthorized


### GET /api/status

#### Description
tells the state of the API

#### Request
- **Headers**: None
- **URL parameters**: None
- **Body Parameters**: None

#### Response
Returns a JSON format.
- for example
  -```
    {
      "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston Churchill"
    }
   ```
- **Status code**:
	- 201 OK
	- 400 
	- 500 
	- 000 Unauthorized


### GET /api/stats

#### Description

#### Request
- **Headers**: None 
- **URL parameters**: None
- **Body Parameters**: None

#### Response
Returns a JSON format.
- for example
  -```
    {
      "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston Churchill"
    }
   ```
- **Status code**:
	- 201 OK
	- 400 
	- 500 
	- 000 Unauthorized


### GET /api/quote

#### Description
Used to get a random quote from Quotilate database.

#### Request
- **Headers**: None
- **URL parameters**: None
- **Body Parameters**: None

#### Response
Returns a random quote in JSON format.
- for example
  -```
    {
      "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston Churchill"
    }
   ```
- **Status code**:
	- 201 OK
	- 400 
	- 500 
	- 000 Unauthorized


### GET /api/quotes

#### Description
Used to get all the quotes saved by a user.

#### Request
- **Headers**: 
- **URL parameters**: 
- **Body Parameters**: This endpoint requires a JSON body with the following fields:

#### Response
GET /api/quote: Returns a random quote in JSON format.
-for example
  -```
    {
      "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston Churchill"
    }
   ```
- **Status code**:
	- 201 OK
	- 400 
	- 500 
	- 000 Unauthorized


### GET [/endpoint]

#### Description

#### Request
- **Headers**: 
- **URL parameters**: 
- **Query parameters**: 
- **Body Parameters**: This endpoint requires a JSON body with the following fields:

#### Response
GET /api/quote: Returns a random quote in JSON format.

for example
{
  "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "author": "Winston Churchill"
}
