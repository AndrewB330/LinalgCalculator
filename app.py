from flask import Flask, render_template, request, jsonify
from linear_algebra import jordan_form,to_fraction, inverse_m, gauss_elim, det_m

app = Flask(__name__)

def fraction_to_str(x):
    if x.denominator == 1:
        return str(x.numerator)
    return str(x.numerator)+'/'+str(x.denominator)

@app.route('/')
def index():
   return render_template('index.html', page = 'start.html')

@app.route('/jor')
def jordan():
   return render_template('index.html', page = 'jordan.html')

@app.route('/det')
def determinant():
   return render_template('index.html', page = 'determinant.html')

@app.route('/inv')
def inverse():
   return render_template('index.html', page = 'inverse.html')

@app.route('/gau')
def gauss():
   return render_template('index.html', page = 'gauss.html')



@app.route('/calculate_jordan')
def calculate_jordan():
    try:
        size = request.args.get('size',1,type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i),) for i in range(size)])
        J,C = jordan_form(matrix)
    except:
        return jsonify(matrix=[[0]*size]*size,message="Something went wrong :(",ok=False)
    return jsonify(matrix=[[fraction_to_str(x) for x in v] for v in J],message="Successfully calculated!",ok=True)


@app.route('/calculate_inverse')
def calculate_inverse():
    try:
        size = request.args.get('size',1,type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i),) for i in range(size)])
        _,rank = gauss_elim(matrix, return_rank=True)
        if rank!=len(matrix):
            return jsonify(matrix=[[0]*size]*size,message="No solution Det = 0",ok=False)
        M = inverse_m(matrix)
    except:
        return jsonify(matrix=[[0]*size]*size,message="Something went wrong :(",ok=False)
    return jsonify(matrix=[[fraction_to_str(x) for x in v] for v in M],message="Successfully calculated!",ok=True)

@app.route('/calculate_gauss')
def calculate_gauss():
    try:
        size = request.args.get('size',1,type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i),) for i in range(size)])
        M = gauss_elim(matrix)
    except:
        return jsonify(matrix=[[0]*size]*size,message="Something went wrong :(",ok=False)
    return jsonify(matrix=[[fraction_to_str(x) for x in v] for v in M],message="Successfully calculated!",ok=True)


@app.route('/calculate_determinant')
def calculate_determinant():
    try:
        size = request.args.get('size',1,type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i),) for i in range(size)])
        res = det_m(matrix)
        print(res)
    except:
        return jsonify(matrix=[[0]*size]*size,message="Something went wrong :(",ok=False)
    return jsonify(result=fraction_to_str(res),message="Successfully calculated!",ok=True)


if __name__ == '__main__':
   app.run()