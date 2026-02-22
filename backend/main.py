from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from temporalio.client import Client
from models import RunWorkflowRequest
from temporal_app.workflows import DAGWorkflow
import uuid

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


temporal_client = None

@app.on_event("startup")
async def startup_event():
    global temporal_client
    temporal_client = await Client.connect("localhost:7233")

@app.post("/api/workflows/run")
async def run_workflow(request: RunWorkflowRequest):
    # console.log("Received workflow run request:", request)
    workflow_id = f"workflow-{uuid.uuid4()}"
    
    try:
        handle = await temporal_client.start_workflow(
            DAGWorkflow.run,
            request.workflow.dict(), request.initial_payload,
            id=workflow_id,
            task_queue="workflow-engine-queue",
        )
        return {"message": "Workflow started", "run_id": handle.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

