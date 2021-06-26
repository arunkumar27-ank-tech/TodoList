from django.db import models


class Todo(models.Model):
    Title = models.CharField(max_length=100)
    completed = models.BooleanField(default=False,  blank=True, null=True)


    def __str__(self):
        return self.Title

# Create your models here.
