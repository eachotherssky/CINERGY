from rest_framework import serializers
from .models import Actor, Comment, Director, Movie

class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ('name', 'profile_path')

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = ('name', 'profile_path')

class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'title', 'overview')


class MovieSerializer(serializers.ModelSerializer):
    class CommentDetailSerializer(serializers.ModelSerializer):
        class Meta:
            model = Comment
            fields = ('id', 'content',)

    comment_set = CommentDetailSerializer(read_only=True, many=True)
    numbers_of_comments = serializers.IntegerField(source='comment_set.count', read_only=True)
    actors = ActorSerializer(many=True)
    director = DirectorSerializer()
    
    class Meta:
        model = Movie
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Comment
        fields = '__all__'