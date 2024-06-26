<!DOCTYPE html>
<html lang="ua">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Форма реєстрації</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }
    .container {
        max-width: 400px;
        margin: 50px auto;
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
        text-align: center;
    }
    label {
        display: block;
        margin-bottom: 10px;
    }
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="tel"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }
    input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
    }
    input[type="submit"]:hover {
        background-color: #45a049;
    }
    .error {
        color: red;
        margin-top: 5px;
    }
    .login-link {
        text-align: center;
        margin-top: 10px;
    }
    .login-link a {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }
</style>
</head>
<body>
    <div class="container">
        <h2>Реєстрація</h2>
        <form action="PHP/register.php" method="POST">
            <label for="username">Ім'я користувача:</label>
            <input type="text" id="username" name="username" required>

            <label for="email_phone">Електронна пошта або телефон:</label>
            <input type="text" id="email_phone" name="email_phone" required>

            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>

            <label for="confirm_password">Підтвердження пароля:</label>
            <input type="password" id="confirm_password" name="confirm_password" required>

            <input type="submit" value="Зареєструватися">
            <div id="password_error" class="error"></div>
        </form>
        <div class="login-link">
            Ще не зареєстровані? <a href="login.html">Перейдіть сюди для реєстрації</a>.
        </div>
    </div>

    <script>
        document.querySelector('form').onsubmit = function(event) {
            event.preventDefault(); // Зупиняємо стандартну дію форми (перенаправлення)
            
            let formData = new FormData(this); // Отримуємо дані форми
            let xhr = new XMLHttpRequest(); // Створюємо об'єкт XMLHttpRequest
    
            xhr.open('POST', 'register.php', true); // Вказуємо метод POST та адресу серверного скрипту
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) { // Перевіряємо стан запросу
                    if (xhr.status === 200) { // Перевіряємо статус коду
                        // Отримали відповідь від сервера
                        document.getElementById('password_error').innerHTML = xhr.responseText;
                    } else {
                        // Виникла помилка під час виконання запиту
                        console.error('Помилка: ' + xhr.status);
                    }
                }
            };
    
            xhr.send(formData); // Відправляємо дані форми на сервер
        };
    </script>
</body>
</html>