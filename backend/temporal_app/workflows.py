import asyncio
from temporalio import workflow
from typing import Dict, Any
from datetime import timedelta


with workflow.unsafe.imports_passed_through():
    from .activities import execute_http_request, transform_data, evaluate_decision 
    
@workflow.defn
class DAGWorkflow:
    @workflow.run
    async def run(self,nodes:list,edges:list,initial_payload:Dict[str, Any]) -> Dict[str, Any]:
        current_payload = initial_payload
        start_node = next((node for node in nodes if node["type"] in ["manualTrigger","webhookTrigger"]),None)
        if not start_node:
            raise ValueError("No valid start node found")
        
        current_node = start_node
        
        while current_node:
            node_type = current_node["type"]
            config = current_node.get("data",{})
            
            if node_type == "httpRequest":
                current_payload = await workflow.execute_activity(execute_http_request, config["url"], config["method"], config.get("headers",{}), current_payload, start_to_close_timeout=timedelta(seconds=10))
            elif node_type == "dataTransformation":
                current_payload = await workflow.execute_activity(transform_data, current_payload, start_to_close_timeout=timedelta(seconds=10))
            elif node_type == "decision":
                isTrue = await workflow.execute_activity(evaluate_decision, current_payload, config, start_to_close_timeout=timedelta(seconds=10))
                
                branch = "trueBranch" if isTrue else "falseBranch"
                edge = next((edge for edge in edges if edge["source"] == current_node["id"] and edge["branch"] == branch),None)
            elif node_type == "wait":
                duration = int(config.get("duration",0))
                await asyncio.sleep(duration) 
            elif node_type == "end":
                return current_payload
            else:
                edge = next((edge for edge in edges if edge["source"] == current_node["id"]),None)
                if not edge:
                    break
                current_node = next((node for node in nodes if node["id"] == edge["target"]),None)
        
        return payload