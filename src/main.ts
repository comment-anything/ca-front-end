import { Cafe } from './Cafe'
import './style.css'



// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//     <div class="nav-bar">
//         <input class="nav-tab" type="button" value="Register">
//         <input class="nav-tab" type="button" value="Comments">
//         <input class="nav-tab" type="button" value="Login">
//     </div>
// `



// let fetcher = new Fetcher()

// new CafeRegisterWindow()

const cafe = new Cafe()
document.body.append(cafe.navbar.el)
console.log("Comment Anywhere Front End running:", cafe);