from fastapi import FastAPI

app = FastAPI(title='Backend API')

@app.get('/')
def root():
    return {
        'message': 'Backend is running ...'
    }


