"""
Gemini client for ALL AI tasks in LearnFlow:
  - Roadmap generation (gemini-1.5-flash with JSON output)
  - Transcript scoring against user criteria (Phase 4)

Uses the google-generativeai SDK.
"""
import json
import re
import google.generativeai as genai
from config import get_settings


def _get_model(model_name: str = "gemini-1.5-flash"):
    """Configure and return a Gemini model instance."""
    settings = get_settings()
    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel(model_name)


def generate_roadmap_sync(
    goal_title: str,
    level: str,
    topic_focus: str,
    skills_tools: list,
    time_weeks: float,
    hours_per_week: float,
    criteria_labels: list,
    inspiration_text: str = "",
    time_strategy: str = "none",
) -> dict:
    """
    Call Gemini to generate a structured learning roadmap.

    Returns a dict with keys:
      nodes: list of node dicts
      edges: list of {source, target} dicts
      total_estimated_hours: float
      exceeds_budget: bool
      budget_overflow_hours: float
    """
    total_hours = time_weeks * hours_per_week

    # Adjust the constraint wording based on time strategy
    if time_strategy == "focus":
        time_constraint = (
            f"STRICT: Total estimated_hours for ALL nodes combined MUST be <= {total_hours}. "
            "Drop non-essential topics to fit within budget."
        )
    elif time_strategy == "extend":
        time_constraint = (
            f"Cover the full topic thoroughly. Budget is {total_hours}h but you may exceed it. "
            "Set exceeds_budget=true and fill budget_overflow_hours."
        )
    elif time_strategy == "compromise":
        time_constraint = (
            f"Budget is {total_hours}h. You may add up to 20% extra (max {total_hours * 1.2:.0f}h). "
            "Prioritise the most important topics."
        )
    else:
        time_constraint = (
            f"Aim to stay within {total_hours}h total. If the topic genuinely requires more time, "
            "set exceeds_budget=true and fill budget_overflow_hours with the extra hours needed."
        )

    inspiration_section = ""
    if inspiration_text.strip():
        inspiration_section = f"\nINSPIRATION / REFERENCE MATERIAL:\n{inspiration_text[:2000]}\n"

    prompt = f"""You are an expert curriculum designer. Generate a video-learning roadmap as JSON.

GOAL: {goal_title}
LEVEL: {level}
TOPIC FOCUS: {topic_focus or "General"}
SKILLS/TOOLS TO COVER: {", ".join(skills_tools) if skills_tools else "As appropriate"}
TIME BUDGET: {total_hours:.0f} hours total ({time_weeks} weeks × {hours_per_week} hrs/week)
TIME RULE: {time_constraint}
{inspiration_section}
EVALUATION PRIORITIES (most important first): {", ".join(criteria_labels) if criteria_labels else "N/A"}

RULES:
- Create 5 to 10 skill nodes (no more, no less)
- Each node: title, description (2-3 sentences), category, estimated_hours, search_queries (3 YouTube search strings), key_concepts (3-5 terms)
- Categories must be one of: Foundations, Core Concepts, Advanced, Projects
- Nodes must be ordered by dependency (prerequisites first)
- Edges define which node must be completed before another
- estimated_hours must be a realistic number for a {level} learner watching YouTube videos
- search_queries should be specific YouTube search terms to find tutorials on that exact node

OUTPUT: Respond with ONLY valid JSON matching this exact schema — no markdown, no explanation:
{{
  "nodes": [
    {{
      "id": "n1",
      "title": "string",
      "description": "string",
      "category": "Foundations|Core Concepts|Advanced|Projects",
      "estimated_hours": 4.0,
      "search_queries": ["query1", "query2", "query3"],
      "key_concepts": ["concept1", "concept2", "concept3"]
    }}
  ],
  "edges": [
    {{"source": "n1", "target": "n2"}}
  ],
  "total_estimated_hours": 0.0,
  "exceeds_budget": false,
  "budget_overflow_hours": 0.0
}}"""

    model = _get_model()
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.4,
            response_mime_type="application/json",
        ),
    )

    raw = response.text.strip()
    # Strip markdown code fences if Gemini adds them despite JSON mode
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    return json.loads(raw)


async def score_transcript(
    transcript_text: str,
    skill_title: str,
    skill_description: str,
    level: str,
    video_title: str,
    channel_name: str,
    duration_minutes: int,
    criteria: list,  # list of {"id": int, "label": str, "sort_order": int}
) -> list:
    """
    Score a video transcript against the user's criteria using Gemini Flash.
    Returns list of {"criteria_id": int, "score": float, "match_level": str, "reasoning": str}
    Phase 4 implementation.
    """
    import asyncio
    criteria_json = json.dumps([{"id": c["id"], "label": c["label"]} for c in criteria])

    prompt = f"""Score this YouTube video for teaching a specific skill.

SKILL: {skill_title}
SKILL DESCRIPTION: {skill_description}
LEARNER LEVEL: {level}
VIDEO: "{video_title}" by {channel_name} ({duration_minutes} min)

TRANSCRIPT SAMPLE:
---
{transcript_text[:3000]}
---

Score each criterion 0.0–1.0. match_level: "high" if score>=0.7, "medium" if >=0.4, else "low".
CRITERIA: {criteria_json}

OUTPUT only valid JSON:
{{"scores": [{{"criteria_id": 1, "score": 0.85, "match_level": "high", "reasoning": "one sentence"}}]}}"""

    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: _get_model().generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
                response_mime_type="application/json",
            ),
        ),
    )
    raw = response.text.strip()
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    data = json.loads(raw)
    return data.get("scores", [])
