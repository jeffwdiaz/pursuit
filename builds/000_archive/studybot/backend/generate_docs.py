import os
import sys
import shutil
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def generate_docs():
    # Create docs directory if it doesn't exist
    docs_dir = Path('docs')
    docs_dir.mkdir(exist_ok=True)

    # Copy OpenAPI schema
    schema_dir = docs_dir / 'schema'
    schema_dir.mkdir(exist_ok=True)
    
    # Generate OpenAPI schema using FastAPI
    from app.main import app
    with open(schema_dir / 'openapi.json', 'w') as f:
        f.write(app.openapi_json())

    # Generate ReDoc HTML
    redoc_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>LLM Learning Bot API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
            body {{
                margin: 0;
                padding: 0;
            }}
        </style>
    </head>
    <body>
        <redoc spec-url='schema/openapi.json'></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
    </body>
    </html>
    """
    
    with open(docs_dir / 'index.html', 'w') as f:
        f.write(redoc_html)

    print("API documentation generated successfully!")
    print(f"Documentation is available at: {docs_dir.absolute()}/index.html")

if __name__ == "__main__":
    generate_docs() 