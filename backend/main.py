from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from temporalio.client import Client
from models import RunWorkflowRequest
from temporal_app.workflows import DAGWorkflow
import uuid
import os
import asyncio
import logging

logger = logging.getLogger("uvicorn.error")

app = FastAPI()

# Use .strip() so an accidentally blank env var falls back to the default
TEMPORAL_HOST      = os.environ.get("TEMPORAL_HOST", "").strip() or "localhost:7233"
TEMPORAL_NAMESPACE = os.environ.get("TEMPORAL_NAMESPACE", "").strip() or "default"

_raw_origins = os.environ.get("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

temporal_client: Client | None = None


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "temporal_connected": temporal_client is not None,
        "temporal_host": TEMPORAL_HOST,
    }


@app.on_event("startup")
async def startup_event():
    """Connect to Temporal in the background — don't crash if it's not ready yet."""
    asyncio.create_task(_connect_temporal_with_retry())


async def _connect_temporal_with_retry():
    global temporal_client
    retries = 0
    while True:
        try:
            logger.info(f"Connecting to Temporal at {TEMPORAL_HOST} (namespace: {TEMPORAL_NAMESPACE})...")
            temporal_client = await Client.connect(TEMPORAL_HOST, namespace=TEMPORAL_NAMESPACE)
            logger.info("Connected to Temporal successfully.")
            return
        except Exception as e:
            retries += 1
            wait = min(5 * retries, 30)   # back off up to 30s
            logger.warning(f"Temporal not ready (attempt {retries}): {e}. Retrying in {wait}s...")
            await asyncio.sleep(wait)


@app.post("/api/workflows/run")
async def run_workflow(request: RunWorkflowRequest):
    if not temporal_client:
        raise HTTPException(status_code=503, detail="Temporal not connected yet — please retry in a moment.")

    workflow_id = f"workflow-{uuid.uuid4()}"

    try:
        result = await temporal_client.execute_workflow(
            DAGWorkflow.run,
            {"workflow": request.workflow, "initial_payload": request.initial_payload},
            id=workflow_id,
            task_queue="dag-workflow-queue",
        )
        return {"workflow_id": workflow_id, "result": result}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/workflows/status/{workflow_id}")
async def get_workflow_status(workflow_id: str):
    if not temporal_client:
        raise HTTPException(status_code=503, detail="Temporal not connected yet.")
    try:
        handle = temporal_client.get_workflow_handle(workflow_id)
        description = await handle.describe()
        return {
            "workflow_id": workflow_id,
            "status": description.status.name,
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Workflow not found: {e}")