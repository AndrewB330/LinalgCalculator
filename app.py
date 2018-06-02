from flask import Flask, render_template, request, jsonify
from linear_algebra import jordan_form, to_fraction, inverse_m, gauss_elim, det_m, eignvalues_approximately
from fractions import Fraction

app = Flask(__name__)


def fraction_to_str(x):
    if x.denominator == 1:
        return str(x.numerator)
    return str(x.numerator) + '/' + str(x.denominator)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/calculate_jordan')
def calculate_jordan():
    try:
        size = request.args.get('width', 1, type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i), ) for i in range(size)])
        j, c = jordan_form(matrix)
    except:
        return jsonify(matrix=[[0] * size] * size, message="Something went wrong :(", ok=False)
    return jsonify(matrix=[[fraction_to_str(x) for x in v] for v in j], message="Successfully calculated!", ok=True)


@app.route('/calculate_inverse')
def calculate_inverse():
    try:
        size = request.args.get('width', 1, type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i), ) for i in range(size)])
        _, rank = gauss_elim(matrix, return_rank=True)
        if rank != len(matrix):
            return jsonify(matrix=[[0] * size] * size, message="No solution Det = 0", ok=False)
        m = inverse_m(matrix)
    except:
        return jsonify(matrix=[[0] * size] * size, message="Something went wrong :(", ok=False)
    return jsonify(matrix=[[fraction_to_str(x) for x in v] for v in m], message="Successfully calculated!", ok=True)


@app.route('/calculate_gauss')
def calculate_gauss():
    try:
        width = request.args.get('width', 1, type=int)
        height = request.args.get('height', 1, type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i), ) for i in range(height)])
        m = gauss_elim(matrix)
    except:
        return jsonify(matrix=[[0] * width] * height, message="Something went wrong :(", ok=False)
    return jsonify(matrix=[[fraction_to_str(x) for x in v] for v in m], message="Successfully calculated!", ok=True)


@app.route('/calculate_determinant')
def calculate_determinant():
    try:
        size = request.args.get('width', 1, type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i), ) for i in range(size)])
        res = det_m(matrix)
    except:
        return jsonify(prefix='???', result='', message="Something went wrong :(", ok=False)
    return jsonify(prefix='Det = ', result=fraction_to_str(res), message="Successfully calculated!", ok=True)


@app.route('/calculate_eigenvalues')
def calculate_eigenvalues():
    try:
        size = request.args.get('width', 1, type=int)
        matrix = to_fraction([request.args.getlist('matrix[{}][]'.format(i), ) for i in range(size)])
        if (matrix != matrix.T).any():
            return jsonify(prefix='???', result='', message="Matrix must be symmetric :(", ok=False)
        res, history = eignvalues_approximately(matrix, return_history=True)
        res = '<br>'.join(map(lambda x: str(round(x, 6)), res))
    except Exception as e:
        print(repr(e))
        return jsonify(prefix='???', result='', message="Something went wrong :(", ok=False)
    return jsonify(prefix='Eigenvalues = <br>',
                   result=res,
                   history=[([[str(round(c, 6)) for c in r] for r in h[0]], (str(h[1][0]), str(h[1][1]))) for h in
                            history],
                   message="Successfully calculated!",
                   ok=True)


if __name__ == '__main__':
    app.run(port=5001)
