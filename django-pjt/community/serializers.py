from rest_framework import serializers
from .models import Review, Comment
from .models import Chat
from accounts.models import User

class ReviewListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('id', 'title', 'content',)


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)

    class CommentDetailSerializer(serializers.ModelSerializer):
        class Meta:
            model = Comment
            fields = ('id', 'content',)

    comment_set = CommentDetailSerializer(read_only=True, many=True)
    numbers_of_comments = serializers.IntegerField(source='comment_set.count', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class ReviewTitleSerializer(serializers.ModelSerializer):
        class Meta:
            model = Review
            fields = ('title',)
    review = ReviewTitleSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

# Chrome extension Chatting 관련
class ChatSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Chat
        fields = ['id', 'content', 'video_time', 'netflix_id', 'created_at', 'username', 'title']
        read_only_fields = ['user']