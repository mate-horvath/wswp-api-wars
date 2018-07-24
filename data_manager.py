import bcrypt
from flask import session
import datetime


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def login_check():
    if 'username' in session:
        login_value = True
    else:
        login_value = False
    return login_value


def permission_check(table, id_number):
    user_id = connections.get_user_id(table, id_number)['users_id']
    if session['id'] == user_id:
        permission = True
    else:
        permission = False
    return permission


def create_vote_data_entry(planet_name, planet_url):
    data = dict()
    planet_id = planet_url.rsplit("/", 2)[1]
    data["user_id"] = session["user_id"]
    data["planet_name"] = planet_name
    data["planet_id"] = planet_id
    data["submission_time"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return data
