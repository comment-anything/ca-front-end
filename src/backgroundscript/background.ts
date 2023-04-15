

console.log("YES THIS RAN!")

let contentPort : browser.runtime.Port
let popupPort : browser.runtime.Port

function connected(p:browser.runtime.Port) {
    if(p.name == "cscript-port") {
        contentPort = p
        p.postMessage({
            message: "I see you, content script!"
        })
    }
    if(p.name == "popup-port") {
        popupPort = p
        p.postMessage({
            message: "I see you, popup!",
            url: window.location.href
        })
        if(contentPort != undefined) {
            contentPort.postMessage({
                message: "Background connected to popup!"
            })
            popupPort.postMessage({
                message: "So, can you get messages?!",
                url: window.location.href
            })
        }
    }
}

browser.runtime.onConnect.addListener(connected)


browser.storage.onChanged.addListener((changes)=> {
    contentPort.postMessage({
        message: "background: I registered a browser.storage change!",
        changes: changes
    })
})