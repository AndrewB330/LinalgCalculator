import unittest
from linear_algebra import *
import numpy as np


class TestLinalg(unittest.TestCase):
    def test_rank(self):
        matrix_a = to_fraction(np.array([[3, 1, -2],
                                         [4, -9, 21],
                                         [10, -7, 17]]))
        self.assertEqual(rank_m(matrix_a), 2)

    def test_jordan(self):
        matrix_a = to_fraction(np.array([[0, 1, 0, 0],
                                         [11, 6, -4, -4],
                                         [22, 15, -8, -9],
                                         [-3, -2, 1, 2]]))
        matrix_b = to_fraction(np.array([[-1, 1, 0, 0],
                                         [0, -1, 0, 0],
                                         [0, 0, 1, 1],
                                         [0, 0, 0, 1]]))
        self.assertTrue(equals(jordan_form(matrix_a)[0], matrix_b))

    def test_det(self):
        matrix_a = to_fraction(np.array([[-4, 4, 3, -1, -5, 2],
                                         [-3, 2, 2, 4, 4, -5],
                                         [4, -5, -3, 3, -3, 4],
                                         [1, 0, 1, 1, 4, 2],
                                         [-1, -5, 1, -3, -1, -5],
                                         [-2, -5, -5, -5, -2, -1]]))
        self.assertEqual(det_m(matrix_a), -50960)

    def test_inverse(self):
        matrix_a = to_fraction(np.array([[-4, 4, 3, -1, -5, 2, 0, 4],
                                         [-3, 2, 2, 4, 4, -5, 2, 1],
                                         [4, -5, -3, 3, -3, 4, 3, -5],
                                         [1, 0, 1, 1, 4, 2, -3, 4],
                                         [-1, -5, 1, -3, -1, -5, 1, -3],
                                         [-2, -5, -5, -5, -2, -1, -1, 2],
                                         [3, 0, -4, 2, -4, -1, -3, 2],
                                         [0, -5, 2, 3, 3, 2, 2, -2]]))
        self.assertTrue(equals(inverse_m(inverse_m(matrix_a)), matrix_a))  # double inversion

    def test_jordan_basis(self):
        matrix_a = to_fraction(np.array([[-2, 0, 0, 0, 1, 0],
                                         [0, 2, 1, 0, 0, 2],
                                         [0, 0, 2, 1, 0, 0],
                                         [1, 0, 0, 2, 2, 0],
                                         [0, 0, 0, 0, -3, 1],
                                         [0, 0, 0, 0, 0, -3]]))
        matrix_b = to_fraction(np.array([[-3, 1, 0, 0, 0, 0],
                                         [0, -3, 0, 0, 0, 0],
                                         [0, 0, -2, 0, 0, 0],
                                         [0, 0, 0, 2, 1, 0],
                                         [0, 0, 0, 0, 2, 1],
                                         [0, 0, 0, 0, 0, 2]]))
        matrix_c = to_fraction(np.array([['-1', '-1', '-4', '0', '0', '0'],
                                         ['-1/125', '-248/625', '1/16', '1', '0', '0'],
                                         ['1/25', '-3/125', '-1/4', '0', '1', '0'],
                                         ['-1/5', '4/25', '1', '0', '0', '1'],
                                         ['1', '0', '0', '0', '0', '0'],
                                         ['0', '1', '0', '0', '0', '0']]))
        j, c = jordan_form(matrix_a)
        self.assertTrue(equals(j, matrix_b))
        self.assertTrue(equals(c, matrix_c))

    def test_zero_rank(self):
        matrix_m = np.zeros((19, 17))
        self.assertEqual(rank_m(matrix_m), 0)

    def test_rectangle_matrix_rank(self):
        matrix_m = to_fraction(np.array([[-2, 0, 0, 0, 1, 0, 0, 0, 0],
                                         [0, 2, 1, 0, 0, 2, 0, 0, 0],
                                         [0, 0, 2, 1, 0, 0, 0, 0, 0],
                                         [1, 0, 0, 2, 2, 0, 0, 0, 0],
                                         [0, 0, 0, 0, -3, 1, 0, 0, 0],
                                         [0, 0, 0, 0, 0, -3, 0, 0, 0]]))
        self.assertEqual(rank_m(matrix_m), 6)


if __name__ == '__main__':
    unittest.main()
