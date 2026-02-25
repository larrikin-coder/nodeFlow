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

        print("=" * 60)
        print("WORKFLOW STARTED")
        print(f"initial_payload: {current_payload}")
        print(f"total nodes: {len(nodes)}")
        print(f"total edges: {len(edges)}")
        print("edges detail:")
        for e in edges:
            print(f"  {e['source']} --[{e.get('sourceHandle')}]--> {e['target']}")
        print("=" * 60)

        # Find start node
        current_node = next(
            (n for n in nodes if n["type"] in ["manualTrigger", "webhookTrigger"]),
            None,
        )
        if not current_node:
            raise ValueError("No valid start node found")

        while current_node:
            node_type = current_node["type"]
            config = current_node.get("data", {})

            print(f"\n>>> NODE: {node_type} (id={current_node['id']})")
            print(f"    config: {config}")
            print(f"    payload_in: {current_payload}")

            # HTTP Request
            if node_type == "httpRequest":
                current_payload = await workflow.execute_activity(
                    execute_http_request,
                    args=[
                        current_payload,
                        config.get("url", ""),
                        config.get("method", "GET"),
                        config.get("headers", {}),
                        config.get("body", {}),
                    ],
                    start_to_close_timeout=timedelta(seconds=10),
                )
                print(f"    payload_out: {current_payload}")

            # Transform
            elif node_type in ("dataTransformation", "transformData"):
                current_payload = await workflow.execute_activity(
                    transform_data,
                    args=[current_payload, config],
                    start_to_close_timeout=timedelta(seconds=10),
                )
                print(f"    payload_out: {current_payload}")

            # Decision
            elif node_type == "decision":
                is_true = await workflow.execute_activity(
                    evaluate_decision,
                    args=[current_payload, config],
                    start_to_close_timeout=timedelta(seconds=10),
                )
                print(f"    decision result: {is_true}")

                target_handle = "true" if is_true else "false"
                edge = next(
                    (
                        e for e in edges
                        if e["source"] == current_node["id"]
                        and e.get("sourceHandle") == target_handle
                    ),
                    None,
                )
                print(f"    looking for sourceHandle='{target_handle}' → found edge: {edge}")

                if not edge:
                    print("    NO MATCHING EDGE — breaking workflow")
                    break
                current_node = next(
                    (n for n in nodes if n["id"] == edge["target"]), None
                )
                continue

            # Wait
            elif node_type == "wait":
                duration = int(config.get("duration", 0))
                print(f"    sleeping {duration}s")
                await workflow.sleep(duration)
                print(f"    sleep done")

            # End
            elif node_type == "end":
                print(f"\n=== WORKFLOW COMPLETE === final payload: {current_payload}")
                return current_payload

            # Follow default next edge
            edge = next(
                (e for e in edges if e["source"] == current_node["id"]),
                None,
            )
            print(f"    next edge: {edge}")

            if not edge:
                print("    NO NEXT EDGE — breaking workflow")
                break

            current_node = next(
                (n for n in nodes if n["id"] == edge["target"]),
                None,
            )

        print(f"\n=== WORKFLOW ENDED (loop exit) === final payload: {current_payload}")
        return current_payload