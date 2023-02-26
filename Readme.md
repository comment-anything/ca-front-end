# Comment Anywhere Front End

`src    ` Typescript source code and static assets.

`dist   ` Build output folder.

`docs   ` Relevant documentation and notes.

`assets ` Static assets (specific to the browser extension) to bundle with the extension.

#### Instructions

- Create a `.env` file in the root folder with the address of the comment-anywhere server you are using.

Example:

```env
VITE_API_ADDRESS=http://localhost:3000
VITE_JWT_COOKIE_NAME=ca-auth-tok
```

- Run `npm run dev` to serve the application to localhost.

- Changes to source code is synchronized. (No need to refresh your browser!)

#### Firefox Extension Testing

- Open `package.json`. Assure the command used for `"build-extension"` is compatible with your OS.

- Run `npm run build-extension`

- Open the link `about:debugging#/runtime/this-firefox`.

- Click `Load Temporary Add-on`.

- Select `manifest.json` from the `dist` directory.

- Click `Reload` if necessary.

#### TODO

- **See if Vite offers command to include contents from `assets` into `dist`**

- Description of transpilation process.

- Description of testing process

- Description of folders
