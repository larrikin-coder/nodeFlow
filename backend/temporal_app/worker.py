import asyncio
from temporalio.client import Client
from temporalio.worker import Worker
from .activities import execute_http_request, transform_data, evaluate_decision
from .workflows import DAGWorkflow


async def main():
    client = await Client.connect("localhost:7233")
    worker = Worker(client, task_queue="dag-workflow-queue", workflows=[DAGWorkflow], activities=[execute_http_request, transform_data, evaluate_decision])
    print( "Starting temporal worker...")
    await worker.run()
    
if __name__ == "__main__":
    asyncio.run(main())
    
    
    