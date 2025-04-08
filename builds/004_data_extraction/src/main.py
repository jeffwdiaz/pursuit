"""
Main Data Extraction Script

This script serves as the entry point for the data extraction process.
It implements a class-based structure for handling different file types.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Type, List
from datetime import datetime
import os
from pathlib import Path
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

    @classmethod
    def scan_directory(cls, directory_path: str) -> List[Dict[str, Any]]:
        """
        Scan a directory for supported files and process them.
        
        Args:
            directory_path (str): Path to the directory to scan
            
        Returns:
            List[Dict[str, Any]]: List of processed data from all supported files
            
        Raises:
            FileNotFoundError: If the directory does not exist
        """
        # Convert to Path object for better path handling
        directory = Path(directory_path)
        
        if not directory.exists():
            raise FileNotFoundError(f"Directory not found: {directory_path}")
            
        if not directory.is_dir():
            raise NotADirectoryError(f"Path is not a directory: {directory_path}")
            
        results = []
        
        # Scan for supported files
        for file_path in directory.glob("*"):
            if file_path.is_file():
                try:
                    # Try to detect file type
                    file_type = BaseExtractor.detect_file_type(str(file_path))
                    
                    # Create appropriate extractor
                    extractor = cls.create_extractor(str(file_path))
                    
                    # Extract and process data
                    raw_data = extractor.extract_data(str(file_path))
                    transformed_data = extractor.transform_data(raw_data)
                    formatted_data = extractor.format_output(transformed_data)
                    
                    # Add file information to metadata
                    formatted_data["metadata"]["file_name"] = file_path.name
                    formatted_data["metadata"]["file_path"] = str(file_path)
                    
                    results.append(formatted_data)
                    
                except ValueError as e:
                    # Skip unsupported file types
                    print(f"Skipping unsupported file {file_path.name}: {str(e)}")
                except Exception as e:
                    # Log other errors but continue processing
                    print(f"Error processing file {file_path.name}: {str(e)}")
                    
        return results 