# KNOWFLOW AI extraction service

FastAPI service for evidence-first PDF/DOCX ingestion. It extracts embedded text, chunks it and emits candidate excerpts only when explicit task/decision/risk/blocker/dependency/ownership/open-question markers appear. It does not hallucinate missing facts or invent confidence scores.

```bash
python -m venv .venv
# activate the environment
pip install -r requirements.txt
# set AI_SERVICE_API_KEY to the same value configured in backend/.env
uvicorn app.main:app --reload --port 8000
```

Scanned PDFs need OCR, which is intentionally not enabled in this MVP. Findings require human review.
