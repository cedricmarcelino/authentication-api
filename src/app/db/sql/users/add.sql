INSERT INTO members(username,password,email,first_name,last_name)
VALUES($1,$2,$3,$4,$5)
RETURNING username, email, first_name, last_name