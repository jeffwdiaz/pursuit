import pytest
import sys
import os
import coverage
from coverage.config import CoverageConfig

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_tests():
    # Configure coverage
    config = CoverageConfig()
    config.branch = True
    config.source = ['app']
    config.omit = ['tests/*', 'scripts/*']
    config.report_omit = ['tests/*', 'scripts/*']
    config.fail_under = 80

    # Start coverage measurement
    cov = coverage.Coverage(config=config)
    cov.start()

    # Run tests
    result = pytest.main(["-v", "tests/"])

    # Stop coverage measurement and generate report
    cov.stop()
    cov.save()
    cov.report()

    return result

if __name__ == "__main__":
    sys.exit(run_tests()) 