"""Test script to verify report-lost submission works end-to-end."""
import json, requests, io, time
from PIL import Image

BASE = "http://localhost:8000/api"

# ── 1. Register a new user ─────────────────────────────────────────────
timestamp = int(time.time())
email = f"test_submit_user_{timestamp}@example.com"
password = "Test1234!"

print(f"\n[1] Registering test user: {email} ...")
reg_resp = requests.post(f"{BASE}/auth/register", json={
    "name": "Test User",
    "email": email,
    "password": password
})
if reg_resp.status_code != 200:
    print(f"  ❌ Registration failed: {reg_resp.text}")
    exit(1)
print("  ✅ User registered successfully")

# ── 2. Login ───────────────────────────────────────────────────────────────────
print("\n[2] Logging in...")
resp = requests.post(f"{BASE}/auth/login", data={"username": email, "password": password})
if resp.status_code != 200:
    print(f"  ❌ Login failed. Status: {resp.status_code}")
    print("  Response:", resp.text)
    exit(1)
else:
    print(f"  ✅ Logged in successfully")

token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# ── 3. Create a tiny test image in memory ─────────────────────────────────────
print("\n[2] Creating test image...")
img = Image.new("RGB", (100, 100), color=(73, 109, 137))
buf = io.BytesIO()
img.save(buf, format="JPEG")
buf.seek(0)
print("  ✅ Image ready (100x100 JPEG)")

# ── 4. Submit report-lost WITH image ──────────────────────────────────────────
print("\n[3] Submitting report-lost with image...")
files = {"image": ("test.jpg", buf, "image/jpeg")}
data = {
    "title": "Test Blue Bag",
    "description": "A blue laptop bag with test sticker",
    "location": "Library",
    "date_lost": "2026-03-28",
    "category": "Electronics"
}
resp = requests.post(f"{BASE}/items/lost", headers=headers, data=data, files=files)
print(f"  Status: {resp.status_code}")
print(f"  Response: {resp.text[:300]}")

if resp.status_code == 200:
    print("\n✅ SUCCESS — submission with image works correctly!")
else:
    print("\n❌ FAILED — see error above")
