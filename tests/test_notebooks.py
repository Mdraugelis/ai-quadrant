"""
Tests for Jupyter notebooks to ensure all cells execute successfully.
"""

import os
import sys
import subprocess
import tempfile
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import pytest

# Add src to path for notebook imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

NOTEBOOKS_DIR = os.path.join(os.path.dirname(__file__), '..', 'notebooks')
TIMEOUT = 300  # 5 minutes timeout per notebook


def get_notebook_paths():
    """Get all notebook paths in the notebooks directory."""
    notebook_paths = []
    for filename in os.listdir(NOTEBOOKS_DIR):
        if filename.endswith('.ipynb') and not filename.startswith('.'):
            notebook_paths.append(os.path.join(NOTEBOOKS_DIR, filename))
    return sorted(notebook_paths)


def execute_notebook(notebook_path):
    """
    Execute a notebook and return True if successful, False otherwise.
    
    This method is more robust than nbval as it:
    - Ignores logging output differences
    - Has configurable timeouts
    - Focuses on execution success rather than output matching
    """
    with open(notebook_path, 'r') as f:
        nb = nbformat.read(f, as_version=4)
    
    # Configure the executor
    ep = ExecutePreprocessor(
        timeout=TIMEOUT,
        kernel_name='python3',
        # Allow stderr output (for logging)
        allow_errors=False
    )
    
    try:
        # Execute the notebook
        ep.preprocess(nb, {'metadata': {'path': os.path.dirname(notebook_path)}})
        return True, None
    except Exception as e:
        return False, str(e)


@pytest.mark.parametrize("notebook_path", get_notebook_paths())
def test_notebook_execution(notebook_path):
    """Test that a notebook executes without errors."""
    success, error_message = execute_notebook(notebook_path)
    
    if not success:
        pytest.fail(f"Notebook {os.path.basename(notebook_path)} failed to execute: {error_message}")


def test_notebooks_exist():
    """Test that we have notebooks to test."""
    notebook_paths = get_notebook_paths()
    assert len(notebook_paths) > 0, "No notebooks found to test"
    
    expected_notebooks = [
        '01_risk_distribution_exploration.ipynb',
        '02_temporal_risk_dynamics.ipynb', 
        '03_hazard_modeling.ipynb'
    ]
    
    found_notebooks = [os.path.basename(path) for path in notebook_paths]
    
    for expected in expected_notebooks:
        assert expected in found_notebooks, f"Expected notebook {expected} not found"


if __name__ == "__main__":
    # Run a quick test
    notebook_paths = get_notebook_paths()
    print(f"Found {len(notebook_paths)} notebooks to test:")
    
    for path in notebook_paths:
        print(f"  - {os.path.basename(path)}")
        success, error = execute_notebook(path)
        if success:
            print(f"    ✅ Executed successfully")
        else:
            print(f"    ❌ Failed: {error}")