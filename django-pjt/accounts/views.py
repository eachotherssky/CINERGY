from django.conf import settings  # settings import 추가
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
import requests

# account 정보 받아오기
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    로그인한 사용자의 프로필 정보를 반환
    """
    user = request.user
    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'profile_image': user.profile_image,
        'date_joined': user.date_joined,
        'kakao_id': user.kakao_id,
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def kakao_login(request):
    return Response({'message': 'Kakao login endpoint'})


@api_view(['GET'])
@permission_classes([AllowAny])
def kakao_callback(request):
    code = request.GET.get('code')
    
    # 카카오 토큰 받기
    token_request = requests.post(
        "https://kauth.kakao.com/oauth/token",
        data={
            "grant_type": "authorization_code",
            "client_id": "YOUR_CLIENT_ID",
            "redirect_uri": "http://localhost:5173/kakao/callback",
            "code": code,
        },
    )
    
    token_json = token_request.json()
    access_token = token_json.get('access_token')
    
    # 카카오 사용자 정보 받기
    profile_request = requests.get(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    profile_json = profile_request.json()
    
    kakao_account = profile_json.get('kakao_account')
    
    User = get_user_model()
    if kakao_account:
        email = kakao_account.get('email', '')
        nickname = kakao_account.get('profile', {}).get('nickname', '')
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': nickname or f'kakao_{profile_json.get("id")}',
                'kakao_id': profile_json.get('id')
            }
        )
        
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
        })
    
    return Response({'error': 'Failed to get kakao account info'}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def kakao_callback(request):
    code = request.GET.get('code')
    
    if not code:
        return Response({'error': 'Authorization code not provided'}, status=400)
        
    try:
        token_request = requests.post(
            "https://kauth.kakao.com/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": settings.KAKAO_CLIENT_ID,
                "redirect_uri": settings.KAKAO_REDIRECT_URI,
                "code": code,
            },
        )
        
        # 응답 확인 로깅 추가
        print("Kakao Token Response:", token_request.json())
        
        token_json = token_request.json()
        
        if 'error' in token_json:
            return Response(token_json, status=400)
            
        access_token = token_json.get('access_token')
        
        user_info = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()
        
        # 사용자 정보 확인 로깅 추가
        print("Kakao User Info:", user_info)
        
        kakao_account = user_info.get('kakao_account')
        if kakao_account:
            email = kakao_account.get('email', '')
            nickname = kakao_account.get('profile', {}).get('nickname', '')
            kakao_id = str(user_info.get('id'))
            
            User = get_user_model()
            user, created = User.objects.get_or_create(
                kakao_id=kakao_id,
                defaults={
                    'username': nickname or f'kakao_{kakao_id}',
                    'email': email
                }
            )
            
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'key': token.key,
                'user_id': user.pk,
            })
            
        return Response({'error': 'Failed to get kakao account info'}, status=400)
        
    except Exception as e:
        print("Error in kakao_callback:", str(e))  # 에러 로깅 추가
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_drf_token(request):
    """
    이미 인증된 사용자의 DRF 토큰을 반환
    """
    user = request.user
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
    })