from flask import Flask, render_template, request, jsonify
from linear_algebra import jordan_form,to_fraction

app = Flask(__name__)


@app.route('/')
def index():
   return render_template('index.html')


@app.route('/calculate')
def add_numbers():
    try:
        size = request.args.get('size',1,type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i),) for i in range(size)])
        J,C = jordan_form(matrix)
    except:
        return jsonify(matrix=[[0]*size]*size,message="Something went wrong :(",ok=False)
    return jsonify(matrix=[[x*1.0 for x in v] for v in J],message="Successfully calculated!",ok=True)

if __name__ == '__main__':
   app.run()