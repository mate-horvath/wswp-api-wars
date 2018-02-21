import sql_connection


@sql_connection.connection_handler
def register_user(cursor, username, password_hash):
    cursor.execute("""
    INSERT INTO users
    VALUES (DEFAULT, %(username)s, %(password_hash)s)
    """, {"username": username, "password_hash": password_hash})
