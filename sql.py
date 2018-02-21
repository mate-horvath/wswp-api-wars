import sql_connection


@sql_connection.connection_handler
def register_user(cursor, username, password_hash):
    cursor.execute("""
    INSERT INTO users
    VALUES (DEFAULT, %(username)s, %(password_hash)s)
    """, {"username": username, "password_hash": password_hash})


@sql_connection.connection_handler
def login_user(cursor, username):
    cursor.execute("""
    SELECT password_hash FROM users
    WHERE username = %(username)s
    """, {"username": username})
    return cursor.fetchone()
