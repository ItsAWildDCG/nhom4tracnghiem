* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background: linear-gradient(to bottom, #fff5f5, #ffffff);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  text-align: center;
}

.card {
  width: 380px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.header {
  background: #ff1f2d;
  color: white;
  padding: 30px 20px;
}

.header h1 {
  margin: 0;
}

.header p {
  margin-top: 8px;
  font-size: 14px;
}

.form {
  padding: 25px;
  text-align: left;
}

label {
  font-size: 14px;
  font-weight: bold;
}

.input-box {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 8px 0 16px;
}

.input-box i {
  color: #888;
  font-size: 18px;
}

.input-box input {
  border: none;
  outline: none;
  flex: 1;
  margin-left: 8px;
}

.toggle {
  cursor: pointer;
}

button {
  width: 100%;
  background: #ff1f2d;
  border: none;
  color: white;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background: #e60012;
}

.switch {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.switch a {
  color: #ff1f2d;
  font-weight: bold;
  cursor: pointer;
  margin-left: 4px;
}

.footer {
  margin-top: 16px;
  font-size: 13px;
  color: #777;
}

.hidden {
  display: none;
}
