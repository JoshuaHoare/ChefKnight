# ------------ base python layer ------------
FROM python:3.12-slim AS base
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code after dependencies are installed
COPY backend/ backend/

# ------------ copy pre-built static (placeholder) -------------
COPY static/ /app/static

# ------------ final image -------------

EXPOSE 8000
CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
