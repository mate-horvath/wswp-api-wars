from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sql
import data_manager
import json

app = Flask(__name__)
app.secret_key = 'secret'


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/registration', methods=["GET", "POST"])
def registration():
    if request.method == "POST":
        username = request.form['username']
        password = data_manager.hash_password(request.form['password'])
        try:
            sql.register_user(username, password)
            return json.dumps({'status': url_for("index")})
        except:
            return json.dumps({'status': 'FAILED'})
    return render_template("registration.html")


@app.route('/logout', methods=['GET'])
def logout():
    if data_manager.login_check():
        session.clear()
        return redirect(url_for("index"))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST' and 'username' not in session:
        username = request.form['username']
        try:
            user_data = sql.login_user(username)[0]
            password_hash = user_data["password_hash"]
        except IndexError:
            return json.dumps({'status': 'FAILED'})
        if data_manager.verify_password(request.form['password'], password_hash):
            session["username"] = username
            session["user_id"] = user_data["id"]
            return json.dumps({'status': url_for("index")})
        else:
            return json.dumps({'status': 'FAILED'})
    return render_template("login.html")


@app.route('/vote', methods=['POST'])
def vote():
    if data_manager.login_check():
        vote_data = data_manager.create_vote_data_entry(request.form["planet_name"], request.form["planet_url"])
        sql.voting(vote_data)
    return json.dumps({'status': 'OK'})


@app.route('/voteStatistics', methods=['POST'])
def get_statistics():
    votes = sql.count_votes()
    return jsonify(votes)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True)
