# Project Name

📦 **ToDoTurtle API** is the notification and deadline API for the ToDoTurtle Android App.

## Installation

To install the npm dependencies of the project, follow these steps:

1. Make sure you have Node.js installed on your machine. If not, you can download it from [Node.js website](https://nodejs.org).

2. Open a terminal or command prompt and navigate to the project directory.

3. Run the following command to install the npm dependencies:

   ```bash
   npm install .
   ```

## Setting Up the API keys and files

To set up the `SERVER_KEY` environment variable as the server key of the Firebase Messaging app, follow these steps:

1. Get your server api key from firebase messaging

2. Export it to the same shell instance that you're going to run the app

   ```bash
   export SERVER_KEY=your_server_key_here
   ```

3. Get your Service Account configuration file from google firbase

4. Save your service account configuration file to: src/project-key.json

## Additional Setup

### Installing Forever

To install Forever, a tool for running Node.js applications as a service, execute the following command:

```bash
sudo npm install -g forever
```

## Usage

The API starts as a service with:

```bash
forever start ./src/index.js
```

You can check out the instance with:

```bash
forever list
```
