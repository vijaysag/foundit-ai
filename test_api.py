import requests
import time
import json
import os
import sys
import codecs
from PIL import Image

sys.stdout = codecs.open("c:/Users/vijay/projects/test_api_log.txt", "w", encoding="utf-8")

BASE_URL = "http://localhost:8000"

def create_dummy_image():
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save('dummy.jpg')

def test_api():
    print("Testing Backend API...")
    
    # 1. Register User
    print("\n1. Registering User...")
    user_data = {
        "email": f"test{int(time.time())}@example.com",
        "username": f"testuser{int(time.time())}",
        "password": "password123",
        "name": "Test User"
    }
    r = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
    print(f"Register Status: {r.status_code}")
    print(f"Register Response: {r.text}")
    
    # 2. Login User
    print("\n2. Logging in User...")
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    r = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
    print(f"Login Status: {r.status_code}")
    print(f"Login Response: {r.text}")
    
    token = ""
    if r.status_code == 200:
        token = r.json().get("access_token")
    else:
        print("Login failed, aborting rest of tests.")
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    create_dummy_image()
        
    print("\n3. Testing Report Lost Item...")
    lost_data = {
        "title": "Lost Wallet",
        "description": "Black leather wallet",
        "category": "personal",
        "location": "Library",
        "date_lost": "2026-03-29"
    }
    
    with open("dummy.jpg", "rb") as img_file:
        files = {"image": ("dummy.jpg", img_file, "image/jpeg")}
        r = requests.post(f"{BASE_URL}/api/items/lost", headers=headers, data=lost_data, files=files)
        print(f"Report Lost Status: {r.status_code}")
        print(f"Report Lost Response: {r.text}")
        
    print("\n4. Testing Upload Found Item...")
    found_data = {
        "description": "I found a red square object on a table",
        "location": "Library Table 4"
    }
    with open("dummy.jpg", "rb") as img_file:
        files = {"image": ("dummy.jpg", img_file, "image/jpeg")}
        r = requests.post(f"{BASE_URL}/api/items/found", headers=headers, data=found_data, files=files)
        print(f"Upload Found Status: {r.status_code}")
        print(f"Upload Found Response: {r.text}")
        
    print("\n5. Testing Get Matches...")
    r = requests.get(f"{BASE_URL}/api/items/matches", headers=headers)
    print(f"Get Matches Status: {r.status_code}")
    print(f"Get Matches Response: {r.text[:500]}..." if len(r.text) > 500 else f"Get Matches Response: {r.text}")
    
    if os.path.exists("dummy.jpg"):
        os.remove("dummy.jpg")

if __name__ == "__main__":
    test_api()
    sys.stdout.close()
