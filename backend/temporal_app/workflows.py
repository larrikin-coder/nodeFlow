from temporalio import workflow
from typing import Dict, Any, List
from datetime import timedelta

with workflow.unsafe.imports_passed_through():
    from .activities import execute_http_request, transform_data, evaluate_decision


@workflow.defn
class DAGWorkflow:

    @workflow.run
    async def run(self, input: Dict[str, Any]) -> Dict[str, Any]:
        nodes: List[Dict[str, Any]] = input["workflow"]["nodes"]
        edges: List[Dict[str, Any]] = input["workflow"]["edges"]
        current_payload: Dict[str, Any] = input.get("initial_payload", {})

        # find start node
        current_node = next(
            (n for n in nodes if n["type"] in ["manualTrigger", "webhookTrigger"]),
            None,
        )
        if not current_node:
            raise ValueError("No valid start node found")

        while current_node:
            node_type = current_node["type"]
            config = current_node.get("data", {})

            if node_type == "httpRequest":
                current_payload = await workflow.execute_activity(
                    execute_http_request,
                    args=[
                        config.get("url", ""),
                        config.get("method", "GET"),
                        config.get("headers", {}),
                        current_payload
                    ],
                    start_to_close_timeout=timedelta(seconds=10),
                )

            # Transform
            elif node_type == "dataTransformation" or node_type == "transformData":
                current_payload = await workflow.execute_activity(
                    transform_data,
                    args=[current_payload, config],
                    start_to_close_timeout=timedelta(seconds=10),
                )

            # Decision
            elif node_type == "decision":
                is_true = await workflow.execute_activity(
                    evaluate_decision,
                    args=[current_payload, config],
                    start_to_close_timeout=timedelta(seconds=10),
                )

                branch = "trueBranch" if is_true else "falseBranch"
                edge = next(
                    (
                        e
                        for e in edges
                        if e["source"] == current_node["id"]
                        and e.get("branch") == branch
                    ),
                    None,
                )
                if not edge:
                    break
                current_node = next(
                    (n for n in nodes if n["id"] == edge["target"]), None
                )
                continue

            # Wait
            elif node_type == "wait":
                duration = int(config.get("duration", 0))
                await workflow.sleep(duration)

            # End
            elif node_type == "end":
                return current_payload

            # default next edge
            edge = next(
                (e for e in edges if e["source"] == current_node["id"]),
                None,
            )
            if not edge:
                break

            current_node = next(
                (n for n in nodes if n["id"] == edge["target"]),
                None,
            )

        return current_payload