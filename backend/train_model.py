
import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Load dataset
df = pd.read_csv("datasets/Crop_recommendation.csv")

print(df.head())
print(df.shape)

# 2. Divide into X and y
X = df.drop("label", axis=1)
y = df["label"]

# 3. Split dataset: 80% training, 20% testing
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 4. Create Random Forest model
model = RandomForestClassifier(random_state=42)

# 5. Train the model
model.fit(X_train, y_train)

# 6. Make predictions using test data
y_pred = model.predict(X_test)

# 7. Evaluate model
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "leaf" / "crop_model.joblib"
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

joblib.dump(
    {
        "model": model,
        "features": list(X.columns)
    },
    MODEL_PATH
)

print("Model saved successfully:", MODEL_PATH)
