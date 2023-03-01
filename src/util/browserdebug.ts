import { Dom } from "./dom";


export function DBMessage(...s: any[]) {
    let div = Dom.div()
    for(let e of s) {
        let span = Dom.textEl("span", e.toString())
        div.append(span)
    }
    document.body.append(div)
}

export function DBKeys(s: any) {
    let div = Dom.div()
    for(let el of Object.keys(s)) {
        let span = Dom.textEl("span", el, undefined, {display:"inline-block", padding: "8px"})
        div.append(span)
    }
    document.body.append(div)
}