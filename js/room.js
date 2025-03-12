"use strict";
import { whiteFigures, blackFigures } from './games/classic/index.js';
import { Review } from './review.js';
import { Board } from './board.js'

window.review = new Review([], whiteFigures, blackFigures);
let ws = sessionStorage.getItem("ws")
  ? new WebSocket(sessionStorage.getItem("ws"))
  : null;

function init() {
  if (!ws) {
    console.error("No WebSocket connection found. Redirecting...");
    window.location.href = "/";
    return
  }

  const splittedLink = window.location.href.split("/");
  const currentRoomId = splittedLink[splittedLink.length - 1];

  ws.onopen = function () {
    ws.send(JSON.stringify({ type: "joinRoom", data: { roomId: currentRoomId } }));
  }

  ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);

    if (!data || !type) {
      console.log("Error: no type or data");
      return;
    }

    const state = new Board(ws);
    console.log(data);
    
    switch (type) {
      case "roomJoined":
        if (data.state.movesHistory.length == 0){
          state.initBoard()
        } else {
          state.applyState(data.state)
        }
        break;
      case "roomList":
        roomList = data
        break;
    }

    document.getElementById("leave-room").addEventListener("click", () => {
      ws.send(JSON.stringify({ type: "leaveRoom", data: { roomId: currentRoomId } }));
      sessionStorage.removeItem("ws");
      window.location.href = "/";
    });

  }
}

init()
