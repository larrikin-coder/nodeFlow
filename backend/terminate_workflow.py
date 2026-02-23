import asyncio
from temporalio.client import Client

async def main():
    try:
        client = await Client.connect("localhost:7233")
        handle = client.get_workflow_handle("workflow-200d08ee-709d-4d72-96fe-aa3b562d64e8")
        await handle.terminate(reason="Terminating stuck workflow")
        print("Successfully terminated workflow execution.")
    except Exception as e:
        print(f"Error terminating workflow: {e}")

if __name__ == "__main__":
    asyncio.run(main())
