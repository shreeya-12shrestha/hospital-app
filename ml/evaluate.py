import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
# 1. Load the same data the model was trained on
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