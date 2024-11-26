from django.urls import path
from . import views

urlpatterns = [
    # 리뷰 게시글 전체 조회 & 생성
    path("reviews/", views.review_list),
    # 리뷰 게시글 상세 조회 & 삭제 & 수정
    path("reviews/<int:review_pk>/", views.review_detail),
    # 선택한 리뷰 게시글의 댓글 상세 조회 & 삭제 & 수정
    path("comments/<int:comment_pk>/", views.comment_detail),
    # 선택한 리뷰 게시글의 댓글 생성
    path("reviews/<int:review_pk>/comments/", views.comment_create),
    # Chrome extentions 관련
    path('api/chats/create/', views.create_chat, name='create_chat'),
    path('api/chats/<str:netflix_id>/', views.get_movie_chats, name='get_movie_chats'),
    # 추천 관련
    path('api/recommended/', views.get_recommended_content, name='recommended_content'),
]