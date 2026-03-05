import asyncio
import os
import logging
from temporalio.client import Client
from temporalio.worker import Worker
from .activities import execute_http_request, transform_data, evaluate_decision
from .workflows import DAGWorkflow

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Use .strip() to handle accidentally empty Railway env vars
TEMPORAL_HOST = os.environ.get("TEMPORAL_HOST", "").strip() or "localhost:7233"
TEMPORAL_NAMESPACE = os.environ.get("TEMPORAL_NAMESPACE", "").strip() or "default"


async def main():
    logger.info(f"Worker attempting to connect to Temporal at {TEMPORAL_HOST}...")
    
    # Retry loop so the worker doesn't crash if it boots faster than Temporal
    retries = 0
    client = None
    while not client:
        try:
            client = await Client.connect(TEMPORAL_HOST, namespace=TEMPORAL_NAMESPACE)
            logger.info("Worker connected to Temporal successfully!")
        except Exception as e:
            retries += 1
            wait = min(5 * retries, 30)
            logger.warning(f"Temporal not ready (attempt {retries}): {e}. Retrying in {wait}s...")
            await asyncio.sleep(wait)

    worker = Worker(
        client,
        task_queue="dag-workflow-queue",
        workflows=[DAGWorkflow],
        activities=[execute_http_request, transform_data, evaluate_decision],
    )
    
    logger.info("Starting temporal worker definition (dag-workflow-queue)...")
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())