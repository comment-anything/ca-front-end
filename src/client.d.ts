
export type ClientMap = {
    'register': Client.Register
}

export namespace Client {
    
    // Register is dispatched to the server once the user submits for account registration.
    type Register = {
        Username      : string  // Account username
        Password      : string  // Account password
        RePassword    : string  // Retyped password for authentication
        Email         : string  // Associated email for account
        AgreedToTerms : boolean // Indicate if the user agreed to the terms of service
    }
    
}

