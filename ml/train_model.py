import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Load the dataset
data = pd.read_csv('Training.csv')
data = data.loc[:, ~data.columns.str.contains('^Unnamed')]  # drop any empty column

# 2. Split into symptoms (X) and the disease label (y)
X = data.drop(columns=['prognosis'])
y = data['prognosis']

# 3. Train the model — this line IS the learning
model = RandomForestClassifier()
model.fit(X, y)

# 4. Save the trained model and the symptom list
joblib.dump(model, 'disease_model.pkl')
joblib.dump(list(X.columns), 'symptoms.pkl')

print("Model trained and saved.")
print("Symptoms:", len(X.columns), "| Diseases:", len(y.unique()))

# 5. Quick test prediction
sample = pd.DataFrame([[0] * len(X.columns)], columns=X.columns)
for s in ['itching', 'skin_rash', 'nodal_skin_eruptions']:
    sample.loc[0, s] = 1
print("Test:", model.predict(sample)[0])