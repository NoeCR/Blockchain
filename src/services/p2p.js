import WebSocket from 'ws';

const { P2P_PORT = 5000, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = {
  BLOCKS: 'blocks',
  TX: 'transaction',
  WIPE: 'wipe_memorypool',
};

class P2PService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on('connection', (socket) => this.onConnection(socket));

    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.onConnection(socket));
    });

    console.log(`Service ws:${P2P_PORT} listening....`);
  }

  onConnection(socket) {
    const { blockchain } = this;
    console.log('[ws.socket]: connected.');
    this.sockets.push(socket);
    socket.on('message', (message) => {
      const { type, value } = JSON.parse(message);

      try {
        if (MESSAGE.BLOCKS === type) blockchain.replace(value);
        else if (MESSAGE.TX === type) blockchain.addOrUpdate(value);
        else if (MESSAGE.WIPE === type) blockchain.wipe();
      } catch (error) {
        throw Error(error);
      }
    });

    socket.send(JSON.stringify({ type: MESSAGE.blocks, value: blockchain.blocks }));
  }

  sync() {
    const { blockchain: { blocks } } = this;

    this.broadcast(MESSAGE.BLOCKS, blocks);
  }

  broadcast(type, value) {
    console.log(`[ws.bradcast]${type}..`);
    const message = JSON.stringify({ type, value });

    this.sockets.forEach((socket) => socket.send(message));
  }
}

export { MESSAGE };
export default P2PService;
