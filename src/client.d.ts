

// Typing for standard HTTPMethods.
type HTTPMethod = {
    POST : "POST",
    GET: "GET",
    PUT: "PUT"
}
// ClientMap maps API end points with the expected JSON data type for that endpoint. For example, "commentAnywhere.com/register" expects to receive an HTTP request with a body of type Client.Register
export type ClientMap = {
    'register': [Client.Register, HTTPMethod.POST],
    'login': [Client.Login, HTTPMethod.POST]
}

// The Client namespace contains data structures that are sent to the server.
export namespace Client {
    
    // Register is dispatched to the server once the user submits for account registration.
    type Register = {
        Username       : string  // Account username
        Password       : string  // Account password
        RetypePassword : string  // Retyped password for authentication
        Email          : string  // Associated email for account
        AgreedToTerms  : boolean // Indicate if the user agreed to the terms of service
    }
    // logs you in
    type Login = {
        Username       : string  // Account username
        Password       : string  // Account password
    }
}

