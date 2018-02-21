from flask import Flask, render_template, request, redirect, url_for, session
import sql
import data_manager

app = Flask(__name__)
app.secret_key = 'secret'


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/registration', methods=["GET", "POST"])
def registration():
    if request.method == "POST":
        username = request.form['username']
        password = data_manager.hash_password(request.form['password'][0])
        sql.register_user(username, password)
        return redirect(url_for("login"))
    return render_template("registration.html")


@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST' and 'username' not in session:
        username = request.form['username']
        try:
            password_hash = sql.login_user(username)["password_hash"]
        except IndexError:
            return redirect(url_for("login"))
        print(data_manager.verify_password(request.form['password'][0], password_hash))
        if data_manager.verify_password(request.form['password'][0], password_hash):
            session["username"] = username
            return redirect("index")
    return render_template("login.html")


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True)
