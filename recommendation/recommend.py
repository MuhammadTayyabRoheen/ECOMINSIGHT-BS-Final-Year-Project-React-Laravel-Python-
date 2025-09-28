import pandas as pd
import requests
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta

# ✅ Load recent interaction data
df = pd.read_csv('interactions.csv')
df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df[df['timestamp'] >= datetime.now() - timedelta(days=30)]

# ✅ Weight = recency × type
df['recency_weight'] = df['timestamp'].apply(lambda t: 1 / (1 + (datetime.now() - t).days))
df['type_weight'] = df['interaction_type'].map({'view': 1, 'order': 3})
df['weight'] = df['recency_weight'] * df['type_weight']

# ✅ Pivot matrix + cosine similarity
pivot = df.pivot_table(index='user_id', columns='product_id', values='weight', fill_value=0)
similarity = cosine_similarity(pivot)
similar_df = pd.DataFrame(similarity, index=pivot.index, columns=pivot.index)

# ✅ Top popular products (as fallback)
popular_products = (
    df[df['interaction_type'] == 'order']
    .groupby('product_id')
    .size()
    .sort_values(ascending=False)
    .index.tolist()
)

# ✅ Recommendation function
def get_recommendations(user_id, top_n=5):
    seen = set(df[df['user_id'] == user_id]['product_id']) if user_id in df['user_id'].values else set()
    recs = {}

    if user_id in pivot.index:
        similar_users = similar_df[user_id].sort_values(ascending=False)[1:]
        for sim_user in similar_users.index:
            for pid, score in pivot.loc[sim_user].items():
                if pid not in seen:
                    recs[pid] = recs.get(pid, 0) + score

    result = [pid for pid, _ in sorted(recs.items(), key=lambda x: x[1], reverse=True)[:top_n]]

    # 🔁 Fallback: fill remaining with popular even if seen
    for pid in popular_products:
        if len(result) >= top_n:
            break
        if pid not in result:
            result.append(pid)

    return result

# ✅ Send results to Laravel
for uid in pivot.index:
    recommended = get_recommendations(uid)
    print(f"User {uid} → Recommended: {recommended}")
    if recommended:
        payload = [{'user_id': uid, 'product_id': pid, 'score': 1} for pid in recommended]
        try:
            r = requests.post("http://127.0.0.1:8000/api/recommendations/import", json=payload)
            print("✅ Sent to Laravel" if r.status_code == 200 else f"❌ Failed: {r.text}")
        except Exception as e:
            print(f"❌ Exception: {e}")
