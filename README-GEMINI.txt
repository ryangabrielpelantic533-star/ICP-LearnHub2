ICP LearnHub - Gemini backend

1. Stop the running server in PowerShell with Ctrl+C.
2. Extract this ZIP into your ICP_LearnHub project folder and replace server.js and package.json when asked.
   Do not delete ICP_LearnHub.html or your existing .env file.
3. Open .env in the project folder.
4. Replace the old OPENAI_API_KEY line with:
   GEMINI_API_KEY=your_Gemini_key
   Keep GEMINI_MODEL=gemini-2.5-flash and PORT=3000.
   Remove old OPENAI_* lines.
5. In PowerShell, make sure the prompt is in the ICP_LearnHub folder, then run:
   & "C:\Program Files\nodejs\npm.cmd" install
6. When installation finishes, run:
   & "C:\Program Files\nodejs\npm.cmd" start
7. Keep PowerShell open and visit:
   http://localhost:3000/ICP_LearnHub.html

Never share your .env file or API key. The Gemini API free tier has usage limits and availability can vary by model and region.
