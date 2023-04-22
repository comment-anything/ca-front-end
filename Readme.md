# Comment Anywhere Front End

Comment Anywhere is a browser extension created by Karl Miller and Luke Bates for their senior project at PennWest California. It allows users to post comments on any webpage on the internet.

## Build Instructions

Comment Anywhere Front End (Cafe) is coded in Typescript and packaged with Vite. It has no other dependencies. Some testing dependencies will be installed, but they are not currently used.

You must have [npm](https://www.npmjs.com/) installed to execute the build scripts that Cafe uses, and to get the [vite](https://vitejs.dev/) dependency.

If you do not have a .env file, you must create one in the root directory.

It should look like this:

```
# Must match the url where the server is being hosted.
VITE_API_ADDRESS=http://www.commentanywhere.net:3000

# Must match the cookie name set by the back end.
VITE_JWT_COOKIE_NAME=ca-auth-tok

# The key for overall browser storage
VITE_BROWSER_STORAGE_KEY=ca-browser-storage

# EXTENSION_DEBUG
VITE_EXTENSION_DEBUG_MODE=false
```

Run the command `npm i` to install [vite](https://vitejs.dev/). This is the bundler.

Run `npm dist` to build the extension.

Head to `about:debugging` -> `This Firefox` -> `Add Extensions` and open `dist/manifest.json` to test Cafe.

More information about Comment Anywhere can be found on our [devlog](https://comment-anything.github.io/) and on the [static site](http://commentanywhere.net/).

Our source code is not currently open source, though we may release it in the future.

## Folder descriptions

`src    ` Typescript source code and static assets.

`dist   ` Build output folder.

`docs   ` Relevant documentation and notes.

`assets ` Static assets (specific to the browser extension) to bundle with the extension.

#### Instructions on developing

- Create a `.env` file in the root folder with the address of the comment-anywhere server you are using.

Example:

```env
# Must match the url where the server is being hosted.
VITE_API_ADDRESS=http://localhost:3000
# Must match the cookie name set by the back end.
VITE_JWT_COOKIE_NAME=ca-auth-tok
VITE_SETTINGS_STORAGE_KEY=ca-saved-settings
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

#### Implement a Client-Server Communication Entity

- Define the client-side object in `CLIENT.d.ts` to dispatch to the server. Assure member names match the backend names.
  ```ts
  type ClientCommName = {
    Send1: number
    Send2: number
    Send3: number
  }
  
- Add this entry to `ClientMap` in `CLIENT.d.ts`.
  ```ts
  "clientCommName" : [Client.ClientCommName, HTTPMethod["POST"]]
  ```
  
- Append this statement to `setClientEventListeners()` in `Cafe.ts`.
  ```ts
  document.addEventListener("clientCommName", (ev)=>{
    let data = ev.detail
    console.log("CLIENTCOMMNAME EVENT RECEIVED W DATA: ", data)
    my.fetcher.fetch("clientCommName", "POST", data, retrieveResponses)
  })
  ```
  
- Define the server-side response object in `SERVER.d.ts`. Assure member names match the backend names.
  ```ts
  type ServerResponseName = {
    Receive1: number
    Receive2: number
    Receive3: number
  }
  ```
  
- Add this entry to the `ServerMap` in `SERVER.d.ts`.
  ```ts
  "ServerResponseName" : Server.ServerResponseName
  ```
  
- Define a function in `dispatcher.ts` to dispatch the response throughout Cafe.
  ```ts
  dispatchServerResponseName(serverResponse: Server.ServerResponseName, cafe: Cafe) {
    cafe.navbar.someWindow.functionToCallWhenDataIsReceived(serverResponse)
  }
  ```
  
- Add this case statement to the `dispatch()` function in `dispatcher.ts`.
  ```ts
  case "ServerResponseName":
    let rsp = datum.Data as Server.ServerResponseName
    this.dispatchServerResponseName(rsp, cafe)
    break
  ```

- Send a request to the server where needed. (Such as when a button is clicked).
  ```ts
  let ev = new CustomEvent<Client.ClientCommName>("clientCommName", {
    detail: {
      Send1: temp1,
      Send2: temp2,
      Send3: temp3
    }
  }
  document.dispatchEvent(ev)
  ```
  
- Handle the server response in the appropriate function.
  ```ts
  function functionToCallWhenDataIsReceived(data: Server.ServerResponseName) {
    this.thing1 = data.Receive1
    this.thing2 = data.Receive2
    this.thing3 = data.Receive3
  }
  ```

