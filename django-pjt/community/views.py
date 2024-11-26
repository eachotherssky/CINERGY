from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_list_or_404, get_object_or_404

from .models import Review, Comment, Chat
from .serializers import ReviewListSerializer, ReviewSerializer, CommentSerializer, ChatSerializer

from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

# 리뷰 게시글 전체 조회 & 생성
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def review_list(request):
    if request.method == 'GET':
        reviews = get_list_or_404(Review)
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # 현재 로그인된 사용자 정보 추가
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

# 리뷰 게시글 상세 조회 & 삭제 & 수정
@api_view(['GET', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def review_detail(request, review_pk):
    review = get_object_or_404(Review, pk=review_pk)

    if request.method == 'GET':
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    # 리뷰 작성자와 로그인된 사용자가 동일한지 확인
    if review.author != request.user:
        raise PermissionDenied("You do not have permission to edit or delete this review.")

    if request.method == 'DELETE':
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

# 선택한 리뷰 게시글의 댓글 상세 조회 & 삭제 & 수정
@api_view(['GET', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def comment_detail(request, comment_pk):
    comment = get_object_or_404(Comment, pk=comment_pk)

    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    # 리뷰 작성자와 로그인된 사용자가 동일한지 확인
    if comment.author != request.user:
        raise PermissionDenied("You do not have permission to edit or delete this comment.")

    elif request.method == 'DELETE':
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
# 선택한 리뷰 게시글의 댓글 생성
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_create(request, review_pk):
    review = get_object_or_404(Review, pk=review_pk)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(review=review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# Chrome extension Chatting 관련
@api_view(['GET'])
def get_movie_chats(request, netflix_id):
    chats = Chat.objects.filter(netflix_id=netflix_id)
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)


# @api_view(['POST', 'OPTIONS'])  # OPTIONS 메서드 추가
# @permission_classes([IsAuthenticated])
# def create_chat(request):
#     print('Request Method:', request.method)
#     print('Request User:', request.user)
#     print('Request Data:', request.data)
    
#     if request.method == 'OPTIONS':
#         return Response(status=status.HTTP_200_OK)
        
#     elif request.method == 'POST':
#         try:
#             serializer = ChatSerializer(data=request.data, context={'request': request})
#             if serializer.is_valid(raise_exception=True):
#                 serializer.save(user=request.user)
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#         except Exception as e:
#             print('Error:', str(e))
#             return Response(
#                 {'error': str(e)}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat(request):
    try:
        netflix_id = request.data.get('netflix_id')
        title = request.data.get('title')  # 프론트엔드에서 전달된 title
        
        serializer = ChatSerializer(data={
            **request.data,
            'title': title
        })
        
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def get_recommended_content(request):
    # 최근 7일간의 인기 콘텐츠
    recent_date = timezone.now() - timedelta(days=7)
    
    recommended = Chat.objects.filter(
        created_at__gte=recent_date
    ).values(
        'netflix_id',
        'title'
    ).annotate(
        chat_count=Count('id')
    ).order_by('-chat_count')[:5]
    
    return Response(recommended)