#!/usr/bin/env python3
import json, urllib.request, base64, os

TOKEN = os.environ['GH_TOKEN']
headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
}
REPO = "paolorechia/heartofcards"

def api_req(method='GET', path='', data=None):
    url = f"https://api.github.com/repos/{REPO}/{path.lstrip('/')}"
    if data:
        if isinstance(data, str):
            data = data.encode('utf-8')
        req = urllib.request.Request(url, headers=headers, data=data, method=method)
    else:
        req = urllib.request.Request(url, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read()), resp.status
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"API Error {e.code} for {path}: {body[:300]}")
        raise

# Read workflow content
workflow_content = open('.github/workflows/github-pages.yml').read()

# Create/update file directly via contents API
data = json.dumps({
    'message': 'fix: correct concurrency syntax - change cancel-in-flight to cancel-in-process',
    'content': base64.b64encode(workflow_content.encode()).decode(),
    'branch': 'main'
}).encode()

req = urllib.request.Request(
    f"https://api.github.com/repos/{REPO}/contents/.github/workflows/github-pages.yml",
    headers=headers,
    data=data,
    method='PUT'
)
try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    print(f"✅ Created/updated file: {result['path']}")
    print(f"✅ Commit: {result['commit']['sha'][:8]}")
    print(f"🌐 URL: https://github.com/{REPO}/commit/{result['commit']['sha']}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"❌ Failed: {e.code}")
    print(body[:500])
