# accounts/urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    path('', include('dj_rest_auth.urls')),
    path('signup/', include('dj_rest_auth.registration.urls')),
    # 카카오 로그인 URL 추가
    path('kakao/login/', views.kakao_login, name='kakao_login'),
    path('kakao/callback/', views.kakao_callback, name='kakao_callback'),
    # 프로필 페이지
    path('profile/', views.get_user_profile, name='user_profile'),
    # 토큰
    path('token/', views.get_drf_token, name='get_drf_token'),
]