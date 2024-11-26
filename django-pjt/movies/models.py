from django.db import models
from django.conf import settings


class Comment(models.Model):
    user = user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.CharField(max_length=300)

class Genre(models.Model):
    name = models.CharField(max_length=50)

class Actor(models.Model):
    name = models.CharField(max_length=100)
    profile_path = models.CharField(max_length=255, null=True, blank=True)

class Director(models.Model):
    name = models.CharField(max_length=100)
    profile_path = models.CharField(max_length=255, null=True, blank=True)

class Movie(models.Model):
    title = models.CharField(max_length=100)
    original_title = models.CharField(max_length=100, null=True, blank=True)
    release_date = models.DateField()
    runtime = models.IntegerField()
    popularity = models.FloatField()
    vote_average = models.FloatField()
    vote_count = models.IntegerField()
    overview = models.TextField()
    poster_path = models.CharField(max_length=200)
    backdrop_path = models.CharField(max_length=200, null=True, blank=True)
    tagline = models.CharField(max_length=255, null=True, blank=True)
    spoken_languages = models.JSONField(default=list, blank=True)
    keywords = models.JSONField(default=list, blank=True)
    genres = models.ManyToManyField(Genre)
    comments = models.ManyToManyField(Comment)
    actors = models.ManyToManyField(Actor)
    director = models.ForeignKey(Director, on_delete=models.SET_NULL, null=True, blank=True)