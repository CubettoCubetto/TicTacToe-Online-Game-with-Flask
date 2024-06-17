from flask import *
import os
from flask_cors import CORS
import TrisServer

app = Flask(__name__, template_folder=os.getcwd())
CORS(app)

# equivale a /home
@app.route('/')
def home():
    return render_template('Website/Tic Tac Toe/Home/home.html')

@app.route('/home')
def home2():
    return render_template('Website/Tic Tac Toe/Home/home.html')

@app.route('/game')
def return_game_page():
    return render_template("Website/Tic Tac Toe/Game/index.html")

#necessita di nome e password, restituisce il idPlayer2
# restituisce
@app.route('/api/joinRoom', methods=['POST'])
def joinRoom():
    data = request.json
    print("Received JSON data to join a room:", data)
    response_data = TrisServer.joinGame(data["roomName"], data["password"])

    return response_data


# CREATE A ROOM
@app.route('/api/createRoom', methods=['POST'])
def createRoom():
    data = request.json

    print("Received JSON data to create a room:", data)
    response_data = TrisServer.createNewGame(data["roomName"], data["password"])

    return response_data

@app.route('/api/makeMove', methods=['POST'])
def makeMove():
    secret_key = "secretKeyOnlyForDevelopmentPurpose"
    data = request.json
    #   response_data = {
    #       "secret_key: gdfhjghdjghdjghdghjd",
    #       "idPlayer1": "id1"
    #       "move": 8
    #   }

    response_data = TrisServer.makeMove(request)
    return response_data

#  restituisce
#  response_data = {
#     "turno": game.turno,
#     "griglia": game.griglia
#  }
@app.route('/api/updateRoom')
def updateRoom():
    response_data = TrisServer.updateGame(request.cookies.get('idPlayer'))
    return response_data, 201

# quando clicchi il pulsante "restart"
@app.route('/api/resetGame')
def resetGame():
    response_data = TrisServer.resetGame(request.cookies.get('idPlayer'))
    return response_data, 201
if __name__ == '__main__':
    app.run(debug=False, port=8002)
