import { Cafe } from './Cafe'
import { Debug } from './debug/debug'
import './style.css'


const debug_mode : string = import.meta.env.VITE_EXTENSION_DEBUG_MODE
if(debug_mode == "true") {
    console.log("DEBUG MODE")
    const debug = new Debug()
    document.body.append(debug.el)
    debug.log({a:1,b:2})
    debug.log([1,2,3])
    window.console.log = debug.log.bind(debug)
}

const cafe = new Cafe()
document.body.append(cafe.navbar.el)