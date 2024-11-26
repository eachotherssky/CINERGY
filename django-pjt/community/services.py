# community/services.py
import requests
from bs4 import BeautifulSoup

def extract_netflix_title(netflix_id):
    """
    Netflix ID로부터 제목을 추출하는 서비스
    """
    url = f"https://www.netflix.com/watch/{netflix_id}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.find('title')
        return title.text.replace(' | Netflix', '').strip() if title else None
    except Exception as e:
        print(f"Title extraction error: {str(e)}")
        return None