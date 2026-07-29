from fastapi import APIRouter, HTTPException

router = APIRouter(
prefix="/auth",
tags=["Authentication"]
)

users = {}

@router.post("/register")
def register(username: str, password: str):

```
if username in users:
    raise HTTPException(
        status_code=400,
        detail="Username already exists"
    )

users[username] = password

return {
    "message": "User registered successfully",
    "username": username
}
```

@router.post("/login")
def login(username: str, password: str):

```
if username not in users:
    raise HTTPException(
        status_code=404,
        detail="User not found"
    )

if users[username] != password:
    raise HTTPException(
        status_code=401,
        detail="Incorrect password"
    )

return {
    "message": "Login successful",
    "username": username
}
```

@router.get("/users")
def show_users():

```
return {
    "registered_users": list(users.keys())
}
```