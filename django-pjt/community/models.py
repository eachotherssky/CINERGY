from django.db import models
from django.conf import settings


class Review(models.Model):
    title = models.CharField(max_length=25)
    content = models.TextField()
    movie_title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1)


class Comment(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# chrome extention chatting 관련
class Chat(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    video_time = models.FloatField()
    netflix_id = models.CharField(max_length=100)
    title = models.CharField(max_length=255, null=True, blank=True)  # 추가
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['video_time', 'created_at']