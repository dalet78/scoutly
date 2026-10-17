"""Workflow autorizzati dal fondatore: coppie di metadati vincolate."""
ROUTES = {
    'prima-di-pubblicare': {
        'form_name': 'Prima di pubblicare', 'form_version': 2,
        'workflow_id': 'annuncio-da-foto-e-descrizione',
        'email_subject': '[Scoutly][prima-di-pubblicare] Prima di pubblicare — Richiesta bozza annuncio',
    },
    'ristrutturare-o-vendere': {
        'form_name': 'Ristrutturare o vendere così?', 'form_version': 1,
        'workflow_id': 'confronto-ristrutturare-o-vendere',
        'email_subject': '[Scoutly][ristrutturare-o-vendere] Ristrutturare o vendere così? — Richiesta orientamento',
    },
}


def check_route(form_id, version, workflow):
    route = ROUTES.get(form_id)
    if not route or version != route['form_version'] or workflow != route['workflow_id']:
        raise ValueError('Metadati del form discordanti')
    return route
