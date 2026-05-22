#!/usr/bin/env python3
from __future__ import annotations
"""
Ola AI News Bot
- HackerNews API + RSS 피드에서 AI 최신 뉴스 수집
- Claude Haiku로 한국어 재작성 (Ola 커뮤니티 톤)
- Ola 백엔드 POST /api/posts로 자동 발행
- 중복 방지: posted_ids.json으로 이미 올린 뉴스 스킵
"""

import os
import json
import time
import hashlib
import urllib.request
import urllib.parse
from datetime import datetime, timezone

# ── 환경 변수 ──────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
OLA_API_URL       = os.environ.get("OLA_API_URL", "https://harness-backend-psi.vercel.app/api")
BOT_EMAIL         = "ai-news-bot@olalab.kr"
BOT_NAME          = "Ola AI 뉴스봇"
POSTED_IDS_FILE   = "scripts/posted_ids.json"
MAX_POSTS_PER_RUN = 4   # 하루 최대 발행 수

# ── RSS 피드 목록 ──────────────────────────────────────
RSS_FEEDS = [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://venturebeat.com/category/ai/feed/",
    "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
]

# ── AI 관련 HackerNews 키워드 ──────────────────────────
HN_KEYWORDS = [
    "AI", "LLM", "GPT", "Claude", "Gemini", "agent",
    "machine learning", "deep learning", "OpenAI", "Anthropic",
    "artificial intelligence", "transformer", "diffusion",
]


def load_posted_ids() -> set:
    try:
        with open(POSTED_IDS_FILE, "r") as f:
            return set(json.load(f))
    except FileNotFoundError:
        return set()


def save_posted_ids(ids: set):
    with open(POSTED_IDS_FILE, "w") as f:
        json.dump(list(ids), f, indent=2)


def http_get(url: str, headers: dict = None) -> "dict | str | None":
    try:
        req = urllib.request.Request(url, headers=headers or {})
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            ct = resp.headers.get("Content-Type", "")
            if "json" in ct:
                return json.loads(body)
            return body
    except Exception as e:
        print(f"  ⚠️  HTTP 에러: {url[:60]}... → {e}")
        return None


def fetch_hn_ai_stories(limit: int = 20) -> "list[dict]":
    """HackerNews Top Stories에서 AI 관련 항목 필터링"""
    print("📡 HackerNews 수집 중...")
    top_ids = http_get("https://hacker-news.firebaseio.com/v0/topstories.json")
    if not top_ids:
        return []

    stories = []
    for sid in top_ids[:60]:  # 상위 60개만 확인
        story = http_get(f"https://hacker-news.firebaseio.com/v0/item/{sid}.json")
        if not story or story.get("type") != "story":
            continue
        title = story.get("title", "")
        if any(kw.lower() in title.lower() for kw in HN_KEYWORDS):
            stories.append({
                "id": f"hn_{sid}",
                "title": title,
                "url": story.get("url", f"https://news.ycombinator.com/item?id={sid}"),
                "source": "HackerNews",
                "score": story.get("score", 0),
            })
        if len(stories) >= limit:
            break
        time.sleep(0.05)

    stories.sort(key=lambda x: x["score"], reverse=True)
    print(f"  ✅ HackerNews AI 뉴스 {len(stories)}개 발견")
    return stories


def parse_rss_items(xml: str, feed_url: str) -> list[dict]:
    """간단한 RSS XML 파싱 (외부 라이브러리 없이)"""
    import re
    items = []
    source = feed_url.split("/")[2].replace("www.", "")

    for item_xml in re.findall(r"<item>(.*?)</item>", xml, re.DOTALL):
        title_m = re.search(r"<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</title>", item_xml, re.DOTALL)
        link_m  = re.search(r"<link>(.*?)</link>",  item_xml, re.DOTALL)
        desc_m  = re.search(r"<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</description>", item_xml, re.DOTALL)
        if not title_m:
            continue

        title = re.sub(r"<[^>]+>", "", title_m.group(1)).strip()
        url   = link_m.group(1).strip() if link_m else ""
        desc  = re.sub(r"<[^>]+>", "", desc_m.group(1)).strip()[:300] if desc_m else ""
        uid   = "rss_" + hashlib.md5(url.encode()).hexdigest()[:10]
        items.append({"id": uid, "title": title, "url": url, "source": source, "desc": desc})

    return items


def fetch_rss_ai_news() -> "list[dict]":
    """RSS 피드에서 뉴스 수집"""
    print("📡 RSS 피드 수집 중...")
    all_items = []
    for feed_url in RSS_FEEDS:
        xml = http_get(feed_url)
        if xml and isinstance(xml, str):
            items = parse_rss_items(xml, feed_url)
            all_items.extend(items[:5])
            print(f"  ✅ {feed_url.split('/')[2]}: {len(items)}개")
    return all_items


def rewrite_with_claude(title: str, url: str, source: str, desc: str = "") -> "dict | None":
    """Claude Haiku로 한국어 Ola 커뮤니티 글 생성"""
    prompt = f"""당신은 Ola AI 커뮤니티의 AI 뉴스 큐레이터입니다.
아래 해외 AI 뉴스를 한국 AI 커뮤니티(Ola) 스타일로 재작성해주세요.

뉴스 제목: {title}
출처: {source}
링크: {url}
요약: {desc}

다음 형식으로 작성하세요:
---
TITLE: (한국어 제목, 흥미롭고 캐주얼하게, 이모지 포함, 50자 이내)
CONTENT: (본문. 200~350자. 뉴스의 핵심 내용, 왜 중요한지, Ola 커뮤니티에서 관심 가질 포인트. 출처 링크 마지막에 포함. 친근하고 인사이트 있는 톤.)
---

주의:
- 과장하지 말고 사실 중심
- "~했어요", "~네요" 같은 친근한 어투
- 어려운 전문용어는 쉽게 풀어서
- 반드시 원문 링크를 본문 마지막에 포함"""

    payload = json.dumps({
        "model": "claude-haiku-4-5",
        "max_tokens": 600,
        "messages": [{"role": "user", "content": prompt}]
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            text = result["content"][0]["text"]

            # TITLE / CONTENT 파싱
            title_m   = __import__("re").search(r"TITLE:\s*(.+?)(?:\n|$)", text)
            content_m = __import__("re").search(r"CONTENT:\s*([\s\S]+?)(?:---|$)", text)

            if not title_m or not content_m:
                print(f"  ⚠️  파싱 실패: {text[:100]}")
                return None

            return {
                "title":   title_m.group(1).strip(),
                "content": content_m.group(1).strip(),
            }
    except Exception as e:
        print(f"  ❌ Claude API 오류: {e}")
        return None


def post_to_ola(title: str, content: str) -> bool:
    """Ola 백엔드에 포스트 발행"""
    payload = json.dumps({
        "title":    title,
        "content":  content,
        "category": "전문 리포트",
        "userEmail": BOT_EMAIL,
        "userName":  BOT_NAME,
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{OLA_API_URL}/posts",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status in (200, 201)
    except Exception as e:
        print(f"  ❌ Ola POST 오류: {e}")
        return False


def main():
    print(f"\n{'='*50}")
    print(f"🤖 Ola AI News Bot 시작 — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*50}\n")

    posted_ids = load_posted_ids()

    # 뉴스 수집
    hn_stories  = fetch_hn_ai_stories(limit=15)
    rss_stories = fetch_rss_ai_news()
    all_stories = hn_stories + rss_stories

    # 중복 제거
    new_stories = [s for s in all_stories if s["id"] not in posted_ids]
    print(f"\n📋 전체 {len(all_stories)}개 중 신규 {len(new_stories)}개\n")

    if not new_stories:
        print("ℹ️  새 뉴스 없음. 종료합니다.")
        return

    published = 0
    for story in new_stories:
        if published >= MAX_POSTS_PER_RUN:
            break

        print(f"✍️  처리 중: {story['title'][:60]}...")
        rewritten = rewrite_with_claude(
            title=story["title"],
            url=story["url"],
            source=story["source"],
            desc=story.get("desc", ""),
        )
        if not rewritten:
            continue

        time.sleep(1)  # API rate limit 여유

        success = post_to_ola(rewritten["title"], rewritten["content"])
        if success:
            posted_ids.add(story["id"])
            published += 1
            print(f"  ✅ 발행 완료: {rewritten['title']}")
        else:
            print(f"  ❌ 발행 실패")

        time.sleep(2)

    save_posted_ids(posted_ids)
    print(f"\n🎉 완료! 오늘 {published}개 발행\n")


if __name__ == "__main__":
    main()
