"""
Shared helper to build a Temporal client.

Supports two modes:
  1. Local dev / self-hosted: just TEMPORAL_HOST (no TLS)
  2. Temporal Cloud:          TEMPORAL_HOST + TEMPORAL_NAMESPACE
                              + TEMPORAL_TLS_CERT_DATA + TEMPORAL_TLS_KEY_DATA
                              (cert/key contents passed as env vars, not file paths)
"""
import os
import tempfile
from temporalio.client import Client
from temporalio.service import TLSConfig


TEMPORAL_HOST      = os.environ.get("TEMPORAL_HOST", "localhost:7233")
TEMPORAL_NAMESPACE = os.environ.get("TEMPORAL_NAMESPACE", "default")
TLS_CERT_DATA      = os.environ.get("TEMPORAL_TLS_CERT_DATA", "")
TLS_KEY_DATA       = os.environ.get("TEMPORAL_TLS_KEY_DATA", "")


async def connect_temporal() -> Client:
    """Return a connected Temporal client (with or without TLS)."""
    if TLS_CERT_DATA and TLS_KEY_DATA:
        # Temporal Cloud — write cert/key to temp files for the SDK
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pem") as cert_f:
            cert_f.write(TLS_CERT_DATA.encode())
            cert_path = cert_f.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".key") as key_f:
            key_f.write(TLS_KEY_DATA.encode())
            key_path = key_f.name

        tls = TLSConfig(
            client_cert=open(cert_path, "rb").read(),
            client_private_key=open(key_path, "rb").read(),
        )
        return await Client.connect(
            TEMPORAL_HOST,
            namespace=TEMPORAL_NAMESPACE,
            tls=tls,
        )

    # Local dev or self-hosted (no TLS)
    return await Client.connect(TEMPORAL_HOST, namespace=TEMPORAL_NAMESPACE)
