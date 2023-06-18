from django.db import models

# Create your models here.
ROOM_STATUS_CHOICES = (
    ('awaiting', 'Awaiting'),
    ('started', 'Started'),
)


class Room(models.Model):
    group_name = models.CharField(max_length=30, null=False)
    participants = models.IntegerField()
    room_status = models.CharField(max_length=10, choices=ROOM_STATUS_CHOICES)

    @classmethod
    def add_participant(cls, group_name):
        room = Room.objects.filter(group_name=group_name).first()
        
        if not room:
            cls.objects.create(group_name=group_name, participants=1)
            return True
        
        room.participants = room.participants + 1
        room.save()
        
    @classmethod
    def player_count(cls, group_name):
        return cls.objects.filter(group_name=group_name).first().participants

    def remove_participant(self):
        self.participants = self.participants - 1
        self.save()
