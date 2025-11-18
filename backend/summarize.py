"""
Utilities for text summarization using Facebook's BART Large model.
"""

from __future__ import annotations

import logging
import re
from functools import lru_cache
from typing import Iterable, List

from transformers import pipeline

logger = logging.getLogger(__name__)

# BART expects sequences shorter than 1024 tokens. Empirically, ~3.5k characters
# keeps us within that window for typical English prose.
_MAX_CHUNK_CHAR_LENGTH = 3500


@lru_cache(maxsize=1)
def _get_summarizer():
    """Instantiate the Hugging Face summarization pipeline once and reuse it."""
    return pipeline("summarization", model="facebook/bart-large-cnn")


def generate_summary(text: str) -> str:
    """
    Generate an abstractive summary for the provided text.

    The input is split into manageable chunks if it's long. Each chunk is fed
    through BART and the resulting summaries are concatenated.
    """
    cleaned = text.strip()
    if not cleaned:
        return ""

    chunks = _split_into_chunks(cleaned, max_chars=_MAX_CHUNK_CHAR_LENGTH)
    summarizer = _get_summarizer()
    summaries: List[str] = []

    for chunk in chunks:
        word_count = max(len(chunk.split()), 1)
        max_length = min(180, max(40, int(word_count * 0.7)))

        try:
            result = summarizer(
                chunk,
                max_length=max_length,
                do_sample=False,
                truncation=True,
            )
        except Exception:  # pragma: no cover - defensive fallback
            logger.exception("Summarization failed; returning original chunk.")
            summaries.append(chunk)
            continue

        summary_text = result[0]["summary_text"].strip()
        summaries.append(summary_text or chunk)

    return " ".join(summaries).strip()


def _split_into_chunks(text: str, max_chars: int) -> List[str]:
    """Split text into sentence-aware chunks within the provided char limit."""
    sentences = [
        sentence.strip()
        for sentence in re.split(r"(?<=[.!?])\s+", text)
        if sentence.strip()
    ]

    if not sentences:
        return [text]

    chunks: List[str] = []
    current: List[str] = []
    current_len = 0

    for sentence in sentences:
        sentence_len = len(sentence)
        # If the sentence alone is too large, hard split it.
        if sentence_len >= max_chars:
            if current:
                chunks.append(" ".join(current))
                current = []
                current_len = 0
            chunks.extend(_split_long_sentence(sentence, max_chars))
            continue

        projected_len = current_len + sentence_len + (1 if current else 0)
        if projected_len <= max_chars:
            current.append(sentence)
            current_len = projected_len
        else:
            if current:
                chunks.append(" ".join(current))
            current = [sentence]
            current_len = sentence_len

    if current:
        chunks.append(" ".join(current))

    return chunks or [text]


def _split_long_sentence(sentence: str, max_chars: int) -> List[str]:
    """Split oversized sentences into character-based chunks."""
    return [
        sentence[i : i + max_chars].strip()
        for i in range(0, len(sentence), max_chars)
    ]

