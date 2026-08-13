from typing import Set

from aiortc import RTCPeerConnection


active_peer_connections: Set[
    RTCPeerConnection
] = set()


async def create_peer_connection():

    peer = RTCPeerConnection()

    active_peer_connections.add(
        peer
    )


    @peer.on("connectionstatechange")
    async def on_connectionstatechange():

        print(
            "WebRTC connection state:",
            peer.connectionState
        )

        if peer.connectionState in [
            "failed",
            "closed",
            "disconnected"
        ]:

            active_peer_connections.discard(
                peer
            )

            await peer.close()


    return peer