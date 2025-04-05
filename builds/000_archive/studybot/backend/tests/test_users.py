import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.auth import create_access_token

def test_register(client: TestClient, db_session: Session):
    response = client.post(
        "/api/users/register",
        json={
            "email": "test@example.com",
            "password": "test_password",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data

def test_register_existing_email(client: TestClient, db_session: Session):
    # Create a test user
    user = User(
        email="test@example.com",
        hashed_password="test_password",
        full_name="Test User"
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/users/register",
        json={
            "email": "test@example.com",
            "password": "test_password",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 400
    data = response.json()
    assert "email already registered" in data["detail"]

def test_login(client: TestClient, db_session: Session):
    # Create a test user
    user = User(
        email="test@example.com",
        hashed_password="test_password",
        full_name="Test User"
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/users/token",
        data={
            "username": "test@example.com",
            "password": "test_password"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client: TestClient, db_session: Session):
    response = client.post(
        "/api/users/token",
        data={
            "username": "test@example.com",
            "password": "wrong_password"
        }
    )
    assert response.status_code == 401
    data = response.json()
    assert "Incorrect email or password" in data["detail"]

def test_get_current_user(client: TestClient, db_session: Session):
    # Create a test user and token
    user = User(
        email="test@example.com",
        hashed_password="test_password",
        full_name="Test User"
    )
    db_session.add(user)
    db_session.commit()

    token = create_access_token(data={"sub": user.email})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/users/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"

def test_update_user(client: TestClient, db_session: Session):
    # Create a test user and token
    user = User(
        email="test@example.com",
        hashed_password="test_password",
        full_name="Test User"
    )
    db_session.add(user)
    db_session.commit()

    token = create_access_token(data={"sub": user.email})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.put(
        "/api/users/me",
        headers=headers,
        json={
            "email": "updated@example.com",
            "full_name": "Updated User",
            "password": "new_password"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "updated@example.com"
    assert data["full_name"] == "Updated User"

    # Verify the password was updated by trying to login with the new password
    login_response = client.post(
        "/api/users/token",
        data={
            "username": "updated@example.com",
            "password": "new_password"
        }
    )
    assert login_response.status_code == 200 