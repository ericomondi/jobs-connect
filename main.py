from flask import Flask, render_template, redirect, url_for, flash


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/my_orders")
def orders():
    return render_template("orders.html")


@app.route("/my_balance")
def my_balance():
    return render_template("balance.html")



@app.route("/available_orders")
def available_orders():
    return render_template("available_orders.html")



@app.route("/performance_overview")
def perfomance_overview():
    return render_template("performance_overview.html")



@app.route("/referral")
def referral():
    return render_template("referral.html")



@app.route("/tickets")
def tickets():
    return render_template("tickets.html")



@app.route("/news")
def news():
    return render_template("news.html")


if __name__ == '__main__':
    app.run()

