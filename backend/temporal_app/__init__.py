from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    
class WorkflowPayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class RunworkflowResponse(BaseModel):
    workflow: WorkflowPayload
    initial_payload : Dict[str, Any]
    
    