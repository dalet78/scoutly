"""Snapshot ISTAT: codice, denominazione e provincia; nessun dato personale."""
import json
from pathlib import Path

MUNICIPALITIES = {code: f'{name} ({province})' for code, name, province in
                  json.loads(Path(__file__).with_name('comuni.json').read_text())}


def check_municipality(code, city, name=None):
    label = MUNICIPALITIES.get(code)
    if not label or city != ('Milano Comune' if code == '015146' else 'Altro Comune'):
        raise ValueError('Comune non valido o non coerente')
    if name is not None and name != label:
        raise ValueError('Nome del comune discordante')
    return label
