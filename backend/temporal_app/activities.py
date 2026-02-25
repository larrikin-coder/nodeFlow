from temporalio import activity
import httpx
from typing import Dict, Any


@activity.defn
async def execute_http_request(
    payload: Dict[str, Any],
    url: str,
    method: str,
    headers: Dict[str, str],
    body: dict
) -> Dict[str, Any]:
    result = payload.copy()
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=body if body else None
            )
            # Merge api_response into existing payload instead of replacing it
            result["api_response"] = response.json()
            return result
        except Exception as e:
            result["api_response"] = {"status_code": 500, "error": str(e)}
            return result


@activity.defn
async def transform_data(payload: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
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
async def evaluate_decision(payload: Dict[str, Any], config: Dict[str, Any]) -> bool:
    field_name = config.get("field", "")
    field_value = payload.get(field_name) if field_name else None
    operation = config.get("operator", config.get("operation", ""))
    compare_value = config.get("value", "")

    try:
        if operation == "equals":
            return str(field_value) == str(compare_value)
        elif operation == "not_equals":
            return str(field_value) != str(compare_value)
        elif operation == "greater_than":
            return float(field_value) > float(compare_value)
        elif operation == "less_than":
            return float(field_value) < float(compare_value)
        elif operation == "contains":
            return str(compare_value) in str(field_value)
        elif operation == "is_empty":
            return field_value is None or str(field_value).strip() == ""
    except (TypeError, ValueError) as e:
        print(f"Decision evaluation error: {e}")

    return False