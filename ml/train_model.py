import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Load the dataset
data = pd.read_csv('Training.csv')
data = data.loc[:, ~data.columns.str.contains('^Unnamed')]  # drop any empty column

# 2. Remove the copies: the 4920 rows are only 304 different patients
data = data.drop_duplicates()
X = data.drop(columns=['prognosis'])
y = data['prognosis']


# 3. Patients usually mention only a few symptoms, so also learn from partial rows
def partial_copies(X_part, y_part, copies=20, seed=1):
    rng = np.random.default_rng(seed)
    rows, labels = [], []
    for row, label in zip(X_part.to_numpy(), y_part):
        has = np.flatnonzero(row)
        rows.append(row)                                 # keep the full row too
        labels.append(label)
        for _ in range(copies):
            k = rng.integers(1, len(has) + 1)            # between 1 and all of the symptoms
            keep = rng.choice(has, size=k, replace=False)
            new = np.zeros_like(row)
            new[keep] = 1
            rows.append(new)
            labels.append(label)
    return pd.DataFrame(rows, columns=X_part.columns), labels


X_aug, y_aug = partial_copies(X, y)

# 4. Train the model — this line IS the learning
model = RandomForestClassifier(random_state=42)
model.fit(X_aug, y_aug)

# 5. Save the trained model and the symptom list
joblib.dump(model, 'disease_model.pkl', compress=3)   # compressed: ~6 MB instead of ~60 MB
joblib.dump(list(X.columns), 'symptoms.pkl')

print("Model trained and saved.")
print("Training rows:", len(X_aug), "| Symptoms:", len(X.columns), "| Diseases:", y.nunique())

# 6. Quick test prediction with just two symptoms
sample = pd.DataFrame([[0] * len(X.columns)], columns=X.columns)
for s in ['headache', 'high_fever']:
    sample.loc[0, s] = 1
print("Test (headache + high fever):", model.predict(sample)[0])