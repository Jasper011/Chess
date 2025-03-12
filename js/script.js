console.log('client is running');

let serverLink = 'wss://spotty-mango-ferry.glitch.me';
let serverData;
const ip = '192.168.1.6'
try {
    const serverResp = await fetch('http://' + ip + ':4000/check', {
        method: "GET",
        mode: "cors"
    });
    serverData = await serverResp.text();
} catch (e) {
    console.warn(e);
}

if (serverData == 1) {
    console.log('You have a local server ONLINE!');
    serverLink = 'ws://' + ip + ':4000';
}

console.log('Final server link is ' + serverLink);

let ws = sessionStorage.getItem('ws') 
    ? new WebSocket(sessionStorage.getItem('ws')) 
    : new WebSocket(serverLink);

sessionStorage.setItem('ws', serverLink);

console.log(ws);

ws.onopen = function () {
    ws.send(JSON.stringify({ type: "getRooms", data: {} }));
    init();
};
const roomMap = {}

ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);
    const roomListHTML = document.getElementById("rooms");

    if (!data || !type) {
        console.log("Error: no type or data");
        return;
    }

    switch (type) {
        case "roomList":
            displayRooms(data.rooms);
            break;
        case "roomDeleted":
            roomMap[data.roomId]?.remove();
            break;
        case "roomCreated":
            const roomCard = createRoom(data.roomId);
            roomListHTML.append(roomCard);
            break;
    }
};

function createEl(tag, textContent, classList){
    const elem = document.createElement(tag)
    elem.textContent = textContent
    classList && elem.classList.add(classList)
    return elem
}

function createRoom(roomId) {
    const li = createEl("li",  `Room ID: ${roomId}`, "roomCard");
    li.addEventListener("click", () => {
        sessionStorage.setItem('ws', serverLink);
        window.location.href = '/chat/' + roomId;
    });
    const deleteButton = createEl("button",  "Delete", "deleteButton");
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation()
        ws.send(JSON.stringify({ type: "deleteRoom", data: { roomId } }));
    });
    li.append(deleteButton);
    roomMap[roomId] = li
    return li;
}

function displayRooms(roomsId) {
    const roomList = document.getElementById("rooms");
    roomList.innerHTML = "";
    roomsId.forEach(roomId => {
        const li = createRoom(roomId);
        roomList.append(li);
    });
}

function init() {
    const nickname = localStorage.getItem('nickname');
    ws.nickname = nickname;
    document.getElementById("nickname").value = nickname;

    document.getElementById("create-room").addEventListener("click", () => {
        if (!ws.nickname) {
            alert("You need to write your nickname");
            return;
        }
        ws.send(JSON.stringify({ type: "getRooms", data: {} }));
        const roomId = document.getElementById("room-id").value.trim();
        const originLink = window.location.origin + '/game/';
        if (roomId) {
            ws.send(JSON.stringify({ type: "createRoom", data: { roomId, originLink } }));
            sessionStorage.setItem('ws', serverLink);
            window.location.href = '/chat/' + roomId;
        } else {
            console.log("Please enter a room ID");
        }
    });

    document.getElementById("change-name").addEventListener("click", () => {
        const nickname = document.getElementById("nickname").value.trim();
        if (nickname) {
            ws.nickname = nickname;
            localStorage.setItem('nickname', nickname);
        } else {
            alert("You need to write your nickname");
        }
    });
}