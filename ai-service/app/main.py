from __future__ import annotations
import base64, io, re, os, hmac
from typing import Literal
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, Field
from pypdf import PdfReader
from docx import Document

app = FastAPI(title="KNOWFLOW AI extraction service", version="1.0.0")

class ExtractRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    contentBase64: str
    contentType: Literal["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
class Chunk(BaseModel):
    content: str
    page: int | None = None
class Finding(BaseModel):
    category: Literal["TASK","DECISION","RESPONSIBILITY","RISK","BLOCKER","DEPENDENCY","UNRESOLVED_QUESTION"]
    classification: Literal["FACT","INFERENCE","RECOMMENDATION","UNKNOWN"]
    title: str
    description: str
    chunkIndex: int

@app.get("/health")
def health(): return {"status":"ok","service":"knowflow-ai"}

def read_pdf(raw: bytes):
    reader=PdfReader(io.BytesIO(raw))
    return [(i+1, page.extract_text() or "") for i,page in enumerate(reader.pages)]
def read_docx(raw: bytes):
    doc=Document(io.BytesIO(raw))
    text="\n".join(p.text for p in doc.paragraphs if p.text.strip())
    return [(None,text)]
def split_chunks(pages, limit=1800):
    result=[]
    for page,text in pages:
        paragraphs=[p.strip() for p in re.split(r"\n{1,}|(?<=[.!?])\s+",text) if p.strip()]
        current=""
        for para in paragraphs:
            if len(current)+len(para)+1>limit and current:
                result.append({"content":current,"page":page});current=""
            current=(current+"\n"+para).strip()
        if current: result.append({"content":current,"page":page})
    return result

# Conservative, evidence-first extraction: only label text when the source itself contains
# explicit markers. No generated facts, invented confidence scores, or unsupported summaries.
PATTERNS=[
 ("TASK","FACT",r"(?i)\b(?:todo|to-do|task|pending|in progress|completed|done|must implement|implement|fix)\b","Work item"),
 ("DECISION","FACT",r"(?i)\b(?:decided|decision|we chose|selected|will use|agreed to|approved)\b","Recorded decision"),
 ("RISK","FACT",r"(?i)\b(?:risk|may fail|could fail|vulnerable|potential issue|risk of)\b","Recorded risk"),
 ("BLOCKER","FACT",r"(?i)\b(?:blocked|blocker|blocked by|cannot proceed|waiting for)\b","Recorded blocker"),
 ("DEPENDENCY","FACT",r"(?i)\b(?:depends on|required by|dependency|dependent on|requires)\b","Dependency"),
 ("RESPONSIBILITY","FACT",r"(?i)\b(?:owner:|assigned to|responsible for|maintainer:)\b","Recorded responsibility"),
 ("UNRESOLVED_QUESTION","UNKNOWN",r"(?i)(?:\?|\bTBD\b|\bTODO\b|\bunknown\b|\bnot yet decided\b)","Open question or unresolved item")]
@app.post("/v1/extract")
def extract(payload: ExtractRequest, service_key: str | None = Header(default=None, alias="x-knowflow-service-key")):
    expected=os.getenv("AI_SERVICE_API_KEY", "")
    if not expected or not service_key or not hmac.compare_digest(service_key, expected):
        raise HTTPException(401, "Service authentication required")
    try: raw=base64.b64decode(payload.contentBase64,validate=True)
    except Exception: raise HTTPException(400,"Invalid base64 file content")
    if len(raw)>20*1024*1024: raise HTTPException(413,"File exceeds 20 MB limit")
    try:
        pages=read_pdf(raw) if payload.contentType=="application/pdf" else read_docx(raw)
        chunks=split_chunks(pages)
    except Exception as exc: raise HTTPException(422,f"Could not parse document: {type(exc).__name__}")
    if not chunks: raise HTTPException(422,"No extractable text was found. Scanned PDFs require OCR, which is not enabled in this MVP.")
    findings=[]; seen=set()
    for index,chunk in enumerate(chunks):
        for category,classification,pattern,label in PATTERNS:
            for sentence in re.split(r"(?<=[.!?])\s+|\n",chunk["content"]):
                sentence=sentence.strip()
                if len(sentence)<18 or not re.search(pattern,sentence): continue
                key=(category,sentence.lower())
                if key in seen: continue
                seen.add(key)
                findings.append({"category":category,"classification":classification,"title":f"{label}: {sentence[:110]}","description":sentence,"chunkIndex":index})
                if len(findings)>=100: break
            if len(findings)>=100: break
        if len(findings)>=100: break
    return {"chunks":chunks,"findings":findings,"extractionMode":"evidence-first-rules","limitations":["No LLM-generated interpretation is used.","Scanned PDFs without embedded text are not supported; OCR is not enabled.","No confidence score is assigned.","Findings are candidate excerpts and require manager verification."]}
