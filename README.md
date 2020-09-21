# profile dashboard 1.0

> Social network for developers

Mern stack application for developers' connection

```js
const options = {
  uri: encodeURI(
    `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
  ),
  method: "GET",
  headers: {
    "user-agent": "node.js",
    Authorization: `token ${config.get("githubToken")}`
  }
};
```

## Quick Start

### Add a default.json file in config folder with the folowing

```
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": ""
}
```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run both Express & React from root

```bash
npm run dev
```

### Build for production

```bash
cd client
npm run build
```

## App Info

### Author

Jie Li

### Version

1.0.0
