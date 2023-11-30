import openSocket from 'socket.io-client';

let socketAddress = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export const socket = openSocket(socketAddress); 