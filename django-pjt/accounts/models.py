from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    kakao_id = models.CharField(max_length=100, null=True, blank=True)
    profile_image = models.URLField(null=True, blank=True)
    followings = models.ManyToManyField('self', symmetrical=False, related_name='followers')