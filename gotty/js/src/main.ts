import { Hterm } from "./hterm";
import { Xterm } from "./xterm";
import { Terminal, WebTTY, protocols } from "./webtty";
import { ConnectionFactory } from "./websocket";

// @TODO remove these
declare var gotty_auth_token: string;
declare var gotty_term: string;
const wsPath = "/api/moove/iam/cce/kubectl/ws";

const elem = document.getElementById("terminal")

if (elem !== null) {
    var term: Terminal;
    if (gotty_term == "hterm") {
        term = new Hterm(elem);
    } else {
        term = new Xterm(elem);
    }
    const httpsEnabled = window.location.protocol == "https:";
    const params = new URLSearchParams(window.location.search);
    let queryString = "";
    
    let token = params.get("token");
    let regionId = params.get("regionId")
    
    if (token && regionId) {
        queryString = "?token=" + token + "&regionId=" + regionId;
    }
    const url = (httpsEnabled ? 'wss://' : 'ws://') + window.location.host + wsPath + queryString;
    const args = window.location.search;
    const factory = new ConnectionFactory(url, protocols);
    const wt = new WebTTY(term, factory, args, gotty_auth_token);
    const closer = wt.open();

    window.addEventListener("unload", () => {
        closer();
        term.close();
    });
};
