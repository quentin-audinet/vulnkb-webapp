# Vuln-KB website

This website allows user the query the NUS Database of vulnerabilities.

To setup please:
 - install `nodejs` 
 - Create a file `.env` as follow:

```
MYSQL_HOST= <HOSTNAME>
MYSQL_PORT= <PORT USED>
MYSQL_DATABASE= <DB NAME>
MYSQL_USER= <USERNAME>
MYSQL_PASSWORD= <PASSWORD>
```

 - Execute `npm run build`
 - Execute `npm run start`