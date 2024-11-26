from django.urls import path
from . import views

urlpatterns = [
    # 영화 리스트 전체 조회
    path("", views.movie_list),
    # 영화 상세 정보 조회
    path("<int:movie_pk>/", views.movie_detail),
    # 선택한 영화의 댓글 전체 조회 & 생성
    path("<int:movie_pk>/comments/", views.comment_list),
    # 사용자 맞춤형 추천 영화 조회 (구현 예정)
    path("recommended/", views.recommended),
]
