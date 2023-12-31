# Fullstack DashboardTable

Этот проект представляет собой полноценное веб-приложение с клиентской и серверной частями, разработанное с использованием следующих технологий: TypeScript, React, React Hooks, Redux, React-Redux, Redux-toolkit, Redux-thunk, Material-UI (MUI), Express и PostgreSQL.

## Инструкция по установке

Следуйте этим шагам, чтобы успешно установить и запустить проект на вашей локальной машине:

1. Установите зависимости для клиентской части:
    
    - Перейдите в папку `/client`:
        
        `cd ./client`
        
    - Установите зависимости с помощью npm:
        
        `npm install`
        
2. Установите зависимости для серверной части:
    
    - Перейдите в папку `/server`:
        
        `cd ./../server`
        
    - Установите зависимости с помощью npm:
        
        `npm install`
        
3. Настройте файлы окружения:
    
    - Для клиентской части:
        
        - В папке `/client` у вас должен быть файл `.env.production` для продакшн-версии или `.env.development` для разработки.
        - В этом файле установите переменную `REACT_APP_API_URL`, указав ссылку на удаленный сервер.
    - Для серверной части:
        
        - В папке `/server` создайте файл `.env.production.local` для продакшн-версии или `.env.development.local` для разработки.
        - В этом файле установите значения для подключения к базе данных PostgreSQL. Пример:
        
        ```
        DB_HOST=localhost 
        DB_USER=user 
        DB_PASSWORD=password 
        DB_DB=fullstack-test
        ```
        
4. Настройте таблицы PostgreSQL, используя пример в файле `init-db.sql`.
    
5. Перейдите в папку `/client` и запустите проект с помощью команды:
    
    `npm run dev`
    

Теперь проект должен быть успешно установлен и запущен на вашей локальной машине.

## Дополнительная информация

- **Время, затраченное на разработку:** Примерно 50 часов.
- **Версия с TypeScript:** [https://github.com/Polotenhicko/fullstack-test](https://github.com/Polotenhicko/fullstack-test)
- **Версия без TypeScript:** [https://github.com/Polotenhicko/fullstack-test/tree/no-ts](https://github.com/Polotenhicko/fullstack-test/tree/no-ts)

## Деплой

Проект доступен для просмотра по следующей ссылке: [https://polotenhicko.github.io/fullstack-test/](https://polotenhicko.github.io/fullstack-test/)