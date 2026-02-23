from temporalio import activity
import httpx
from typing import Dict, Any


@activity.defn
async def execute_http_request(url:str,method:str,headers:Dict[str, str],body:dict) -> Dict[str, Any]:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(method=method, url=url, headers=headers, json=body if body else None)
            return {"status_code": response.status_code, "response": response.text}
        except Exception as e:
            return {"status_code": 500, "error": str(e)}


@activity.defn
async def transform_data(payload:Dict[str, Any], config:Dict[str, Any]) -> Dict[str, Any]:
    result = payload.copy()
    trans_type = config.get("transformationType")
    field = config.get("field")
    param_value = config.get("value")

    if not field or field not in result:
        return result

    try:
        if trans_type == "uppercase":
            result[field] = str(result[field]).upper()
        elif trans_type == "append":
            result[field] = str(result[field]) + str(param_value)
        elif trans_type == "multiply":
            result[field] = float(result[field]) * float(param_value)
        elif trans_type == "extract":
            result = {field: result[field]}
    except Exception as e:
        print(f"Transform error: {e}")
        
    return result


@activity.defn
async def evaluate_decision(payload:Dict[str, Any],config:Dict[str, Any]) -> bool:
    field_name = config.get("field", "")
    field_value = payload.get(field_name) if field_name else None
    operation = config.get("operator", config.get("operation", ""))
    compare_value = config.get("value", "")
    
    if operation == "equals":
        return str(field_value) == str(compare_value)
    elif operation == "not_equals":
        return str(field_value) != str(compare_value)
    
    return False

