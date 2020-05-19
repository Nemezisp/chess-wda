import openSocket from 'socket.io-client';

let socketAddress = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://chess-wda-server.herokuapp.com/'

export const socket = openSocket(socketAddress); 