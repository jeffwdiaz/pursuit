# Food Impact Visualization Documentation

## Overview
This project provides tools for comparing the environmental impact of different food choices, focusing on greenhouse gas emissions, water usage, and land use.

## Installation
```bash
pip install -e .
```

## Usage
```python
from food_impact.database import create_database

# Create the database
create_database("food_environment.db")
```

## Project Structure
```
project_root/
├── data/                    # For database file and raw data
├── src/                     # Source code
│   └── food_impact/        # Main package
│       └── database/       # Database-related code
├── tests/                  # Test files
├── docs/                   # Documentation
├── requirements.txt
├── setup.py
└── readme.md
```

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 