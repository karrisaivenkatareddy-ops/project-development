import sqlite3

DATABASE_NAME = "visionedge.db"  # Creating database

def get_database():
    connection = sqlite3.connect(DATABASE_NAME)
    return connection


def create_tables():
    connection = get_database()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()

    print("Database created successfully")


def add_user(username, password):
    connection = get_database()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (username, password)
            VALUES (?, ?)
        """, (username, password))

        connection.commit()
        return True

    except sqlite3.IntegrityError:
        return False

    finally:
        connection.close()


def get_user(username):
    connection = get_database()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE username = ?
    """, (username,))

    user = cursor.fetchone()

    connection.close()
    return user


def delete_user(username):
    connection = get_database()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM users
        WHERE username = ?
    """, (username,))

    connection.commit()
    connection.close()

    return True


if __name__ == "__main__":
    create_tables()
