# Comment Anywhere Front End

`src    ` Typescript source code and static assets.

`dist   ` Build output folder.

`docs   ` Relevant documentation and notes.

`assets ` Static assets (specific to the browser extension) to bundle with the extension.

#### Instructions

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

#### TODO

- **See if Vite offers command to include contents from `assets` into `dist`**

- Description of transpilation process.

- Description of testing process

- Description of folders
