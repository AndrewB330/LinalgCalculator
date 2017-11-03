from fractions import Fraction
import numpy as np

to_fraction = np.vectorize(lambda x: Fraction(x))
to_decimal = np.vectorize(lambda x: float(x))


def gauss_elim(in_mat, return_rank=False,return_det=False):
    # gauss elimination
    det = 1
    n,m = in_mat.shape
    mat = in_mat.copy()
    rank = 0
    for col in range(m):
        if rank == n:
            break
        nonzero = np.where(mat[rank:, col] != 0)[0]
        if nonzero.size == 0:
            continue
        minindex = nonzero[np.abs(mat[rank:, col][nonzero]).argmin()]+rank
        if minindex != rank:
            mat[[minindex, rank]] = mat[[rank, minindex]]
        for row in range(0,n):
            if row == rank: continue
            multiplier = mat[row][col]/mat[rank][col]
            mat[row, :] -= multiplier*mat[rank, :]
        det *= mat[rank][col]
        mat[rank, :] /= mat[rank][col]
        rank += 1
    if rank!=len(mat) or mat.shape[0]!=mat.shape[1]:
        det = Fraction(0)
    if return_det and return_rank:
        return mat, rank, det
    if return_det:
        return mat, det
    if return_rank:
        return mat, rank
    return mat


def change_basis(mat,basis):
    # A = C^-1 * B * C
    return inverse_m(basis).dot(mat).dot(basis)


def det_m(mat):
    _,det = gauss_elim(mat,return_det=True)
    return det


def stack_m(mats):
    return np.hstack([m for m in mats if m is not None])


def inverse_m(mat):
    n,m = mat.shape
    # stack our matrix and identity matrix together, and return second half after gauss elimination
    return gauss_elim(np.hstack([mat, to_fraction(np.identity(n))]))[:, n:]


def rank_m(mat):
    if mat is None:
        return 0
    return gauss_elim(mat,return_rank=True)[1]


def fundamental_sols(in_mat):
    n,m = in_mat.shape
    mat = gauss_elim(in_mat)
    nonzero_rows = np.where(mat.any(axis=1))[0]
    dependent_cols = []
    for col in range(m):
        nonzeros = np.where(mat[:, col] != 0)[0]
        if len(nonzeros) == 1 and (col == 0 or np.max(np.abs(mat[nonzeros[0], :col])) == 0):
            dependent_cols.append(col)
    if len(dependent_cols) == 0:
        return to_fraction(np.identity(m))
    independent_cols = [col for col in range(m) if col not in dependent_cols]
    dependent_part = mat[nonzero_rows].T[dependent_cols].T
    independent_part = mat[nonzero_rows].T[independent_cols].T
    solutions = []
    for index in range(len(independent_cols)):
        vec = to_fraction(np.zeros(len(independent_cols)))
        vec[index] = Fraction(1)
        system = gauss_elim(np.hstack([dependent_part,independent_part.dot(vec).reshape(-1, 1)]))
        sol = to_fraction(np.zeros(m))
        sol[dependent_cols] = -system[:, -1]
        sol[independent_cols] = vec
        solutions.append(sol)
    return np.array(solutions)


def jordan_form(in_mat):
    # J = C^-1 * A * C
    # returns J and C
    n,m = in_mat.shape
    C = []
    # TODO: find all eigenvalues of provided matrix!!
    for value in range(-50,50):
        B = in_mat - value*to_fraction(np.identity(n))
        if rank_m(B) == n:
            continue
        all_sols = []
        current_system = B
        prev_dim = 0
        while True:
            all_sols.append(fundamental_sols(current_system))
            if all_sols[-1].shape[0] == prev_dim:
                all_sols.pop()
                break
            prev_dim = all_sols[-1].shape[0]
            current_system = current_system.dot(B)
        height = len(all_sols)-1
        stairs = [None for i in range(height+1)]
        for step in range(height, -1, -1):
            basis = None
            if step != 0: basis = all_sols[step - 1].T
            if step != height and step == 0:
                basis = np.dot(B, stairs[step + 1].T)
            if step != height and step != 0:
                basis = np.hstack([basis, np.dot(B, stairs[step + 1].T)])
            added_basis = None
            rank = rank_m(basis)
            for v in all_sols[step]:
                if rank == len(all_sols[step]):
                    break
                if rank == 0:
                    added_basis, rank = v.reshape(-1,1),1
                if rank_m(stack_m([basis, added_basis, v.reshape(-1,1)])) != rank:
                    added_basis = stack_m([added_basis, v.reshape(-1,1)])
                    rank += 1
            if added_basis is not None:
                stairs[step] = added_basis.T
            if step != height:
                stairs[step] = stack_m([B.dot(stairs[step+1].T), added_basis]).T
        for i in range(len(stairs[0])):
            for j in range(len(stairs)):
                if len(stairs[j]) <= i:
                    break
                C.append(stairs[j][i])
    C = np.array(C).T
    return change_basis(in_mat, C), C


if __name__ == '__main__':
    test = to_fraction(np.array(
        [[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 3, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 3, 1, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 3, 1, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 3, 1, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 3, 1, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 3]]))
    basis = to_fraction(np.array(
        [[1, 0, 0, -1, 0, 0, 0, 0, 0, 0],
         [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
         [1, 0, 1, 0, 0, 0, 0, 1, 1, 0],
         [0, 1, 0, 1, 0, -2, 0, 0, 0, 0],
         [0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
         [1, 0, 2, 1, 0, 0, 0, 2, 1, 0],
         [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
         [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
         [0, 0, 0, 0, -1, 0, 0, 0, 1, 0],
         [0, 0, 0, -1, 0, 0, -2, 0, 0, 1]]))
    test = change_basis(test, basis)
    J, C = jordan_form(test)
    for a,b in zip(to_decimal(test), to_decimal(J)):
        print(a, ' --> ', b)