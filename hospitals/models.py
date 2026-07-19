from django.db import models

class Hospital(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    phone = models.CharField(max_length=20)
    total_beds = models.IntegerField(default=0)
    available_beds = models.IntegerField(default=0)

    def __str__(self):
        return self.name