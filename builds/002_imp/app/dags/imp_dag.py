from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.http.operators.http import SimpleHttpOperator
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.database import update_database
from app.init_chroma import update_chroma_db
from app.topic_utils import process_topics

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'imp_workflow',
    default_args=default_args,
    description='IMP Application Workflow',
    schedule_interval='@daily',
    catchup=False,
    tags=['imp'],
)

# Define tasks
update_db_task = PythonOperator(
    task_id='update_database',
    python_callable=update_database,
    dag=dag,
)

update_chroma_task = PythonOperator(
    task_id='update_chroma_db',
    python_callable=update_chroma_db,
    dag=dag,
)

process_topics_task = PythonOperator(
    task_id='process_topics',
    python_callable=process_topics,
    dag=dag,
)

# Define task dependencies
update_db_task >> [update_chroma_task, process_topics_task] 