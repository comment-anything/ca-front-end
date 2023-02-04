
export namespace Client {
    
    // Register is dispatched to the server once the user submits for account registration.
    type Register = {
        username       : string  // Account username
        password       : string  // Account password
        retypePassword : string  // Retyped password for authentication
        email          : string  // Associated email for account
        agreedToTerms  : boolean // Indicate if the user agreed to the terms of service
    }
    
}

