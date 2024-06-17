
document.addEventListener('DOMContentLoaded', function() {

    var urlServer = "http://127.0.0.1:8002"

    document.getElementById("roomForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        var roomName = document.getElementById("RoomName").value;
        var password = document.getElementById("inputPassword").value;

        

        if(password.length < 4){
            alert("password troppo corta, inserire alemno 4 caratteri")
        }

        else if (event.submitter.id === "createBtn") {
            createRoom(roomName, password);
        } else {
            joinRoom(roomName, password);
        }
    });

    function createRoom(name, password) {
        // Your code to send a POST request to create a room
        console.log("Creating room with name:", name, "and password:", password);

        fetch(urlServer + "/api/createRoom", {
            method: "POST",
            body: JSON.stringify({
                userId: 1,
                roomName: name,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
            jsonAnsw = jsonResponse; // Assign jsonResponse to jsonAnsw
            console.log(jsonAnsw);
            //{idPlayer1: '-3918262213068424652104', managedError: 'null'}

            if(jsonAnsw.managedError != "null"){
                alert("error:" + jsonAnsw.managedError);
            } // Access jsonAnsw here
            else{
                //crete cookie
                document.cookie = `idPlayer=${jsonAnsw.idPlayer1}; path=/; domain=127.0.0.1`;
                console.log("cookie settati:" + document.cookie)
                window.location.href = urlServer + "/game";
            }
            
        });

    }

    function joinRoom(name, password) {
        // Your code to join an existing room
        console.log("Joining room with name:", name, "and password:", password);
        fetch(urlServer + "/api/joinRoom", {
            method: "POST",
            body: JSON.stringify({
                userId: 1,
                roomName: name,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
            jsonAnsw = jsonResponse; // Assign jsonResponse to jsonAnsw
            console.log(jsonAnsw);
            //{idPlayer1: '-3918262213068424652104', managedError: 'null'}

            if(jsonAnsw.managedError != "null"){
                alert("error:" + jsonAnsw.managedError);
            } // Access jsonAnsw here
            else{
                //crete cookie
                document.cookie = `idPlayer=${jsonAnsw.idPlayer1}; path=/; domain=127.0.0.1`;
                console.log("cookie settati:" + document.cookie)
                window.location.href = urlServer + "/game";
            }

        });
    }
});