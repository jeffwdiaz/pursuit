"""
Main Data Extraction Script

This script serves as the entry point for the data extraction process.
It implements a class-based structure for handling different file types.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Type
from datetime import datetime
import os
from extractors.csv_extractor import CSVExtractor
from extractors.excel_extractor import ExcelExtractor
from extractors.json_extractor import JSONExtractor

class BaseExtractor(ABC):
    """
    Abstract base class for all data extractors.
    Defines the common interface and shared functionality.
    """
    def __init__(self):
        self.metadata = {}

    @staticmethod
    def detect_file_type(file_path: str) -> Optional[str]:
        """
        Detect the file type based on the file extension.
        
        Args:
            file_path (str): Path to the file to detect type for
            
        Returns:
            Optional[str]: The detected file type ('csv', 'excel', 'json') or None if not supported
            
        Raises:
            ValueError: If the file type is not supported
        """
        # Get the file extension in lowercase
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        
        # Map extensions to file types
        file_types = {
            '.csv': 'csv',
            '.xlsx': 'excel',
            '.xls': 'excel',
            '.json': 'json'
        }
        
        # Return the file type if supported, otherwise raise error
        if ext in file_types:
            return file_types[ext]
        else:
            raise ValueError(f"File type not supported. Supported types are: {', '.join(file_types.values())}")

    @abstractmethod
    def extract_data(self, file_path: str) -> Dict[str, Any]:
        """
        Extract data from the given file.
        Must be implemented by each specific extractor.
        
        Args:
            file_path (str): Path to the file to extract data from
            
        Returns:
            Dict[str, Any]: Extracted data
        """
        pass

    def transform_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform the extracted data into a standardized format.
        
        Args:
            data (Dict[str, Any]): Raw extracted data
            
        Returns:
            Dict[str, Any]: Transformed data
        """
        self.metadata["transformed_at"] = datetime.now()
        return data

    def format_output(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format the data for final output.
        
        Args:
            data (Dict[str, Any]): Transformed data
            
        Returns:
            Dict[str, Any]: Formatted output with metadata
        """
        return {
            "data": data,
            "metadata": self.metadata
        }

class ExtractorFactory:
    """
    Factory class for creating appropriate data extractors based on file type.
    """
    # Map file types to their corresponding extractor classes
    _extractor_classes = {
        'csv': CSVExtractor,
        'excel': ExcelExtractor,
        'json': JSONExtractor
    }

    @classmethod
    def create_extractor(cls, file_path: str) -> BaseExtractor:
        """
        Create an appropriate extractor based on the file type.
        
        Args:
            file_path (str): Path to the file to extract data from
            
        Returns:
            BaseExtractor: An instance of the appropriate extractor class
            
        Raises:
            ValueError: If the file type is not supported
        """
        # Detect the file type
        file_type = BaseExtractor.detect_file_type(file_path)
        
        # Get the appropriate extractor class
        extractor_class = cls._extractor_classes.get(file_type)
        
        if extractor_class is None:
            raise ValueError(f"No extractor found for file type: {file_type}")
            
        # Create and return an instance of the extractor
        return extractor_class() 