"""
Test script for data extraction functionality.
"""

from src.main import ExtractorFactory
import time

def test_directory_extraction():
    # Path to the input directory
    directory_path = "data/input"
    
    try:
        print(f"Starting directory scan of {directory_path}...")
        start_time = time.time()
        
        # Scan directory and process all supported files
        results = ExtractorFactory.scan_directory(directory_path)
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Print the results
        print("\nExtraction successful!")
        print(f"Time taken: {duration:.2f} seconds")
        print(f"\nProcessed {len(results)} files")
        
        # Print summary for each processed file
        for result in results:
            print("\n" + "="*50)
            print(f"File: {result['metadata']['file_name']}")
            print(f"Path: {result['metadata']['file_path']}")
            print(f"Processed at: {result['metadata']['transformed_at']}")
            print(f"Number of records: {len(result['data'])}")
            
            # Print first few records if available
            if result['data']:
                print("\nFirst few records:")
                for i, record in enumerate(result['data'][:3]):
                    print(f"\nRecord {i + 1}:")
                    for key, value in record.items():
                        print(f"  {key}: {value}")
        
    except Exception as e:
        print(f"Error during extraction: {str(e)}")

if __name__ == "__main__":
    test_directory_extraction() 