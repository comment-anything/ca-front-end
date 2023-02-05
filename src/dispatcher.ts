
import { Cafe } from "./Cafe";
import { CafeNavBar } from "./navbar";
import { ServerResponse, Server, ServerMap } from "./SERVER";

// Dispatcher is responsible for parsing an array of server responses and dispatching them to the appropriate objects around the front end for rendering to the user.
export class Dispatcher {


    // Dispatch uses the “Name” field of the ServerResponse to determine what kind of information is contained in the “Data” field. The “Name” field determines which Dispatcher method is next called, and the object which will render the data is retrieved using the parameter reference to Cafe.
    dispatch(packets:ServerResponse<any>[], cafe: Cafe) {
        for(let datum of packets) {
            switch(datum.Name as keyof ServerMap) {
                case "Message":
                    this.dispatchMessage(datum.Data as Server.Message, cafe.navbar)
                    break;
                case "LoginResponse":
                    let lr = datum.Data as Server.LoginResponse
                    this.dispatchUserUpdate(lr.LoggedInAs, cafe)
                    break;
            }
        }
    }
    
    // dispatchMessage calls displayMessage on the CafeNavbar.message object
    dispatchMessage(message:Server.Message, navbar:CafeNavBar) {
        navbar.message.updateMessage(message)
    }
    
    // dispatchUserUpdate calls userChange on the Cafe root object to change state reflecting any changes that may have happened to the User and to change what is visible on their profile
    dispatchUserUpdate(userProfile:Server.UserProfile, cafe:Cafe) {
        cafe.state.loadProfile(userProfile)
    }

}