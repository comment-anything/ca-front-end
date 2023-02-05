import './style.css'
import { CafeRegisterWindow } from './windows'
import { Client, ClientMap } from './client'
import { Fetcher } from './fetcher'



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="nav-bar">
        <input class="nav-tab" type="button" value="Register">
        <input class="nav-tab" type="button" value="Comments">
        <input class="nav-tab" type="button" value="Login">
    </div>
`



let fetcher = new Fetcher()

new CafeRegisterWindow(fetcher)
