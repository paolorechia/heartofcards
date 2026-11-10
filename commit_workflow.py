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

# Get main branch
main_ref, _ = api_req('GET', 'git/refs/heads/main')
commit_sha = main_ref['object']['sha']
print(f"Main commit: {commit_sha}")

# Get current tree
tree, _ = api_req('GET', f"git/trees/{commit_sha}")
print(f"Tree: {tree['sha'][:8]} ({len(tree['tree'])} entries)")

# Create blob for github-pages.yml
workflow_content = open('.github/workflows/github-pages.yml').read()
blob_data = json.dumps({
    'content': base64.b64encode(workflow_content.encode()).decode(),
    'encoding': 'base64'
})
blob, _ = api_req('POST', 'git/blobs', blob_data)
print(f"Blob: {blob['sha'][:8]}")

# Add blob to existing tree
all_entries = tree['tree'].copy()
# First remove existing workflow file if it exists
all_entries = [e for e in all_entries if not e['path'].startswith('.github/workflows/github-pages.yml')]
all_entries.append({'path': '.github/workflows/github-pages.yml', 'mode': '100644', 'type': 'blob', 'sha': blob['sha']})

# Create new tree
new_tree_data = json.dumps({'tree': all_entries, 'base_tree': tree['sha']})
new_tree, _ = api_req('POST', 'git/trees', new_tree_data)
print(f"New tree: {new_tree['sha'][:8]} ({len(new_tree['tree'])} entries)")

# Create commit
commit_data = json.dumps({
    'message': 'fix: correct concurrency syntax for GitHub Actions',
    'tree': {'sha': new_tree['sha']},
    'parent': commit_sha
})
new_commit, _ = api_req('POST', 'commits', commit_data)
print(f"New commit: {new_commit['sha'][:8]}")

# Update main branch
branch_data = json.dumps({'sha': new_commit['sha']})
api_req('PATCH', 'git/refs/heads/main', branch_data)
print("Branch updated!")
print(f"URL: https://github.com/{REPO}/commit/{new_commit['sha']}")
