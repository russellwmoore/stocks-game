### Stocks ++

Clone down and run `npm i` in root folder and create a postgres db called `ttp`.

Create an account at https://iexcloud.io. Create a .env file with the following info from your iexcloud account: 

```javascript
IEXCLOUD_API_VERSION="stable"
IEXCLOUD_PUBLIC_KEY=YOUR_PUBLIC_KEY_AS_A_STRING
IEXCLOUD_SECRET_KEY=YOUR_PRIVATE_KEY_AS_A_STRING
```

Run `npm run seed` to seed database with 2 users and several transactions.

Run `npm run dev` to build front end and start server on `http://localhost:3000`

