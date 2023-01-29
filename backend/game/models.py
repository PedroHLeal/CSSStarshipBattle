from django.db import models

# Create your models here.

class Room(models.Model):
    group_name = models.CharField(max_length=30, null=False)
    participants = models.IntegerField()

    @classmethod
    def add_participant(cls, group_name):
        room = cls.objects.filter(group_name=group_name).first()
        
        if not room:
            cls.objects.create(group_name=group_name, participants=1)
            return True
        
        if room.participants == 0:
            room.participants = 1
            room.save()
            return True
    
        room.participants = room.participants + 1
        room.save()
        return False
    
    def remove_participant(self):
        self.participants = self.participants - 1
        self.save()