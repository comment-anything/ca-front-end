import { Cafe } from './Cafe'
import './style.css'

const cafe = new Cafe()
document.body.append(cafe.navbar.el)
console.log("Comment Anywhere Front End running:", cafe);