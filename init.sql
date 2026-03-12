CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email TEXT,
  password TEXT
);

INSERT INTO users(email,password) VALUES
('admin@example.com','admin123'),
('user@example.com','password');

SELECT * FROM users WHERE email='' OR 1=1 --' AND password='anything'