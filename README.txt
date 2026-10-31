ICP LEARNHUB — OPENAI BACKEND STARTER

IMPORTANT
- Keep your existing ICP_LearnHub.html in the same folder as server.js.
- Never put your OpenAI API key inside the HTML or share your .env file.
- OpenAI API usage is billed separately from a ChatGPT subscription.

1) Install Node.js (LTS) from https://nodejs.org/
   After installation, close and reopen VS Code.

2) Put these backend files in the SAME folder as ICP_LearnHub.html.

3) In VS Code, choose Terminal > New Terminal.
   Confirm the terminal is in the ICP_LearnHub folder.
   Run:
     node -v
     npm -v

4) Install the packages:
     npm install

5) Create your local key file:
   In the VS Code terminal, run:
     Copy-Item .env.example .env
   Then click .env in Explorer and replace the placeholder value with
   your actual OpenAI API key. Do not include quotes.
   Save the file. Do not share it or upload it.

6) Start the backend:
     npm start

7) Open this address in your browser:
     http://localhost:3000/ICP_LearnHub.html

IMPORTANT: Do not use the Live Server URL (127.0.0.1:5500) for this test.
The backend must serve the page so /api/tutor reaches the Node server.
Keep the VS Code terminal open while using the website.
To stop the backend, click the terminal and press Ctrl+C.

If you see "model not found" or model access errors:
- Check your OpenAI API account has API access and billing configured.
- If your account uses a different available model, change OPENAI_MODEL in .env
  to that model name and restart npm start.

TROUBLESHOOTING
- "node is not recognized": install Node.js LTS, then restart VS Code.
- "OPENAI_API_KEY is missing": check that the file is named exactly .env
  (not .env.txt), then restart npm start.
- "API key was rejected": create/check your key in the OpenAI API platform.
- "usage limit reached": check API billing and usage limits.

This starter connects the existing Ask Tutor, quiz-chat, and lesson-question
generation calls to the OpenAI Responses API. Existing browser-only features
such as the calendar and local demo login are not converted into cloud accounts
or a shared database by this starter.
