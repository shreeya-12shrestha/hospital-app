import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import accuracy_score# 1. Load the same data the model was trained on
data = pd.read_csv('Training.csv')
data = data.loc[:, ~data.columns.str.contains('^Unnamed')]

X = data.drop(columns=['prognosis'])
y = data['prognosis']

print('Rows:', len(data))
print('Unique rows:', len(data.drop_duplicates()))
print('Diseases:', y.nunique())
print('Symptoms per row: average', round(X.sum(axis=1).mean(), 1),
      '| fewest', X.sum(axis=1).min(), '| most', X.sum(axis=1).max())


# 2. The usual way: hold back 20% of the rows for testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)
print('\nNaive split accuracy:', accuracy_score(y_test, model.predict(X_test)))

# How many test rows did the model already see during training?
seen = set(map(tuple, X_train.values))
leaked = sum(tuple(row) in seen for row in X_test.values)
print('Test rows that also appear in training:', leaked, 'of', len(X_test))


# 3. The honest way: remove the copies first, so a test row can't hide in training
unique = data.drop_duplicates()
Xu = unique.drop(columns=['prognosis'])
yu = unique['prognosis']

Xu_train, Xu_test, yu_train, yu_test = train_test_split(
    Xu, yu, test_size=0.25, random_state=42, stratify=yu)
model = RandomForestClassifier(random_state=42).fit(Xu_train, yu_train)
print('\nUnique rows only, accuracy:', accuracy_score(yu_test, model.predict(Xu_test)),
      f'({len(Xu_test)} test rows)')

# 5-fold cross-validation: test on 5 different slices and average them
folds = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(RandomForestClassifier(random_state=42), Xu, yu, cv=folds)
print('5-fold scores:', scores.round(3), '| average:', round(scores.mean(), 3))

# 4. Real patients: they usually mention only 1-3 symptoms
rng = np.random.default_rng(0)
print('\nWhen the patient mentions only a few symptoms:')
for k in [1, 2, 3, 4, 5]:
    X_few = Xu_test.to_numpy(copy=True)
    for row in X_few:
        has = np.flatnonzero(row)                    # positions of this patient's symptoms
        keep = rng.choice(has, size=min(k, len(has)), replace=False)
        row[:] = 0                                   # forget all symptoms...
        row[keep] = 1                                # ...except k random ones
    acc = accuracy_score(yu_test, model.predict(pd.DataFrame(X_few, columns=X.columns)))
    print(f'  {k} symptom(s): {acc:.0%}')