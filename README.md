Time tracker app

App build with symfony api and react fron

Symfony part

composer install

create a db named time-tracker or change .env line 25 time-tracker

php bin/console make:migration
php bin/console doctrine:migrations:migrate

symfony server:start

be sure that the project start on 127.0.0.1:8000 address or change the address on the front project .env REACT_APP_SERVER_URL=http://127.0.0.1:8000

React part

npm install
npm run start