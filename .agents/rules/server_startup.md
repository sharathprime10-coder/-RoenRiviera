# Server Startup Rule

Whenever the user asks for the localhost link (e.g. "give me the local host link"):
1. Automatically start the frontend server in the background using `npm run dev` from the `frontend` directory.
2. Automatically start the backend server in the background using `python -m uvicorn app.main:app --reload --port 8000` from the `backend` directory.
3. Simply provide the frontend link `http://localhost:8443` to the user.
