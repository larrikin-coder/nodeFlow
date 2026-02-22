from temporalio import activity
import httpx
from typing import Dict, Any


@activity.defn
async def execute_http_request(url:str,method:str,headers:Dict[str, str],body:dict) -> Dict[str, Any]:
    async with httpx.AsyncClient() as client:
        response = await client.request(method=method, url=url, headers=headers, json=payload)
        # response.raise_for_status()
        return {status_code: response.status_code, "response": response.json()}


@activity.defn
async def transform_data(payload:Dict[str, Any]) -> Dict[str, Any]:
    pass


@activity.defn
async def evaluate_decision(payload:Dict[str, Any],config:Dict[str, Any]) -> Dict[str, Any]:
    field_value = payload.get(config["field"])
    operation = config["operation"]
    compare_value = config["value"]
    return False

