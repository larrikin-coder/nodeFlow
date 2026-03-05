import asyncio
import os
from temporalio.client import Client
from temporalio.worker import Worker
from .activities import execute_http_request, transform_data, evaluate_decision
from .workflows import DAGWorkflow

TEMPORAL_HOST = os.environ.get("TEMPORAL_HOST", "localhost:7233")
TEMPORAL_NAMESPACE = os.environ.get("TEMPORAL_NAMESPACE", "default")


async def main():
    client = await Client.connect(TEMPORAL_HOST, namespace=TEMPORAL_NAMESPACE)
    worker = Worker(
        client,
        task_queue="dag-workflow-queue",
        workflows=[DAGWorkflow],
        activities=[execute_http_request, transform_data, evaluate_decision],
    )
    print("Starting temporal worker...")
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())