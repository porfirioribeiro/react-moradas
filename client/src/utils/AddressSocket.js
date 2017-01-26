const origin = process.env.NODE_ENV !== 'production' ? 'ws://0.0.0.0:8080/ws' : `${location.origin.replace(/^http/, 'ws')}/ws`;


export default class AddressSocket {

  constructor() {
    this.socket = new WebSocket(origin);
    this.socket.onopen = this.onSocketOpen;
    this.socket.onmessage = this.onSocketMessage;
  }

  onSocketOpen=() => {
    console.log('Socket open.');
    this.send('message', { message: 'What is the meaning of life, the universe and everything?' });
    console.log('Message sent.');
  }

  onSocketMessage=(message) => {
    console.log('Socket server message', message);
    const data = JSON.parse(message.data);
    console.log(data);
  }

  send(type, data) {
    this.socket.send(JSON.stringify({
      type,
      data,
    }));
  }
}
