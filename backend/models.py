from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class NodeState(BaseModel):
    id: str
    type: str # 'manualTrigger', 'webhookTrigger', 'httpRequest', 'transformData', etc.
    data: Dict[str, Any]

class EdgeState(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None # Important for 'decision' nodes ('true' or 'false')

class WorkflowPayload(BaseModel):
    nodes: List[NodeState]
    edges: List[EdgeState]

class RunWorkflowRequest(BaseModel):
    workflow: WorkflowPayload
    initial_payload: Dict[str, Any]
