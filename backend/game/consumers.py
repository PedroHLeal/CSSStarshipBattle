import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from game.models import Room


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "game_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        is_first = Room.add_participant(self.room_group_name)
        self.accept()

        if is_first:
            self.message({
                "type": "setHost"
            })

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        room = Room.objects.filter(group_name=self.room_group_name).first()
        room.remove_participant()

    def receive(self, text_data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "message", "message": text_data}
        )

    def message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps(event))
