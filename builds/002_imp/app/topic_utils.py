import json
from pathlib import Path
from typing import List, Dict, Optional

class TopicManager:
    def __init__(self):
        self.data_path = Path("data/llm_related_topics.json")
        self.topics = self._load_topics()

    def _load_topics(self) -> List[Dict]:
        """Load topics from JSON file"""
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Topics file not found at {self.data_path}")
            return []
        except json.JSONDecodeError:
            print(f"Warning: Invalid JSON in topics file at {self.data_path}")
            return []

    def get_topic_by_id(self, topic_id: int) -> Optional[Dict]:
        """Get a topic by its ID"""
        return next((topic for topic in self.topics if topic["id"] == topic_id), None)

    def get_topics_by_name(self, topic_name: str) -> List[Dict]:
        """Get all topics with a specific name"""
        return [topic for topic in self.topics if topic["topic"].lower() == topic_name.lower()]

    def get_all_topics(self) -> List[Dict]:
        """Get all topics"""
        return self.topics

    def get_unique_topics(self) -> List[str]:
        """Get list of unique topic names"""
        return list(set(topic["topic"] for topic in self.topics))

    def get_topic_benefits(self, topic_id: int) -> List[str]:
        """Get benefits for a specific topic"""
        topic = self.get_topic_by_id(topic_id)
        return topic["benefits"] if topic else []

    def get_topic_challenges(self, topic_id: int) -> List[str]:
        """Get challenges for a specific topic"""
        topic = self.get_topic_by_id(topic_id)
        return topic["challenges"] if topic else []

    def get_topic_definition(self, topic_id: int) -> Optional[str]:
        """Get definition for a specific topic"""
        topic = self.get_topic_by_id(topic_id)
        return topic["definition"] if topic else None

    def get_topic_use_case(self, topic_id: int) -> Optional[str]:
        """Get use case for a specific topic"""
        topic = self.get_topic_by_id(topic_id)
        return topic["use_case"] if topic else None

    def get_topic_relation(self, topic_id: int) -> Optional[str]:
        """Get relation to LLMs for a specific topic"""
        topic = self.get_topic_by_id(topic_id)
        return topic["relation_to_LLMs"] if topic else None 