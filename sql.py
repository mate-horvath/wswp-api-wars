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
    SELECT password_hash, id FROM users
    WHERE username = %(username)s
    """, {"username": username})
    return cursor.fetchall()


@sql_connection.connection_handler
def voting(cursor, vote_data):
    cursor.execute("""
    INSERT INTO planet_votes
    VALUES (DEFAULT, %(submission_time)s, %(planet_name)s, %(user_id)s, %(planet_id)s)""",
                   {"submission_time": vote_data["submission_time"], "planet_name": vote_data["planet_name"],
                    "user_id": vote_data["user_id"], "planet_id": vote_data["planet_id"]})


@sql_connection.connection_handler
def count_votes(cursor):
    cursor.execute("""SELECT planet_name, count(planet_name) AS vote_count FROM planet_votes
                      GROUP BY planet_name;""")
    return cursor.fetchall()
