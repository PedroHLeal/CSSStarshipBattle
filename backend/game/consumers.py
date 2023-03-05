import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from game.models import Room


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "game_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self._add_participant()

        await self.send(
            text_data=json.dumps(
                {
                    "message": {
                        "type": "setPlayer",
                        "playerNumber": await self._get_participant_count(),
                    }
                }
            )
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self._remove_participant()

    async def receive(self, text_data):
        message = json.loads(text_data)
        if message.get("type") == "addPlayer":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "message",
                    "message": {
                        "type": "addPlayer",
                        "playerNumber": message["playerNumber"],
                    },
                },
            )
        else:
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "message", "message": message}
            )

    async def message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def _add_participant(self):
        Room.add_participant(self.room_group_name)

    @database_sync_to_async
    def _remove_participant(self):
        room = Room.objects.filter(group_name=self.room_group_name).first()
        room.remove_participant()

    @database_sync_to_async
    def _get_participant_count(self):
        return Room.player_count(self.room_group_name)
