import './style.css'
import { CafeRegisterWindow } from './Windows.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    
    <div class="nav-bar">
        <input class="nav-tab" type="button" value="Register">
        <input class="nav-tab" type="button" value="Comments">
        <input class="nav-tab" type="button" value="Login">
    </div>

    <div class="cafe-window section" id="cafe-register-window">
    
        <div class="section-title">Register Account</div>
        
        <p><div class="field-label">Username</div> <input type="form" class="input-field"></p>
        <p><div class="field-label">Password</div> <input type="password" class="input-field"></p>
        <p><div class="field-label">Retype Password</div> <input type="password" class="input-field"></p>
        <p><div class="field-label">Email</div> <input type="email" class="input-field"></p>
        
    </div>
`

let registerWindow: CafeRegisterWindow