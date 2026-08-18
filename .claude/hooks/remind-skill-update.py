#!/usr/bin/env python3
"""
PostToolUse hook: after an Edit/Write/MultiEdit touches src/, workers/,
integrations/, or wrangler.toml, remind Claude to check whether
docs/SKILL.md (the project reference doc) needs updating to match.

Never blocks the tool call and never errors the turn — worst case it's a
no-op. See "Keeping this file current" in docs/SKILL.md.
"""
import json
import re
import sys

WATCHED = re.compile(r'[\\/](src|workers|integrations)[\\/]')


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return

    file_path = payload.get('tool_input', {}).get('file_path') or ''
    if not file_path:
        return

    normalized = file_path.replace('\\', '/')
    is_watched = bool(WATCHED.search(file_path)) or normalized.endswith('wrangler.toml')
    if not is_watched:
        return

    print(json.dumps({
        'hookSpecificOutput': {
            'hookEventName': 'PostToolUse',
            'additionalContext': (
                'This edit touched a file covered by docs/SKILL.md (the project '
                'reference doc). If it changed something documented there — new '
                'page/route, design token, shared component, backend integration, '
                'env var/secret, or convention — update docs/SKILL.md in this same '
                'session.'
            ),
        }
    }))


if __name__ == '__main__':
    main()
