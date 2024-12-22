export default {
    config: {
        DB: {
            user: 'DB_USER',
            password: 'DB_PASSWORD',
            server: 'DB_SERVER',
            database: 'DB_DATABASE',
            trustServerCertificate: {
                __name: 'DB_TRUST_SERVER_CERTIFICATE',
                __format: 'json',
            },
        },
        JWT: 'JWT',
    },
};