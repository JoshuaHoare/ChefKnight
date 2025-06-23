# ------------ base python layer ------------
FROM python:3.12-slim AS base
WORKDIR /app

# Install Git and Python dependencies
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code after dependencies are installed
COPY backend/ backend/

# ------------ copy static HTML/JS frontend -------------
COPY static/ /app/static

# ------------ final image -------------
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
