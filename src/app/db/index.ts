import pgPromise from 'pg-promise'; // pg-promise core library
import { IInitOptions, IDatabase, IMain } from 'pg-promise';
import { IExtensions, InitTable, UsersRepository } from './repos';
// require('dotenv').config(); // only for dev purposes

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj: ExtendedProtocol, dc: any) {
        // Database Context (dc) is mainly needed for extending multiple databases with different access API.

        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        obj.users = new UsersRepository(obj, pgp);
        obj.initTable = new InitTable(obj, pgp);
    }
};

// Initializing the library:
const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
const dbHost = process.env.DB_HOST || 'localhost'
const postgresUser = process.env.POSTGRES_USER
const postgresDB = process.env.POSTGRES_DB
const postgresPW = process.env.POSTGRES_PASSWORD
const db: ExtendedProtocol = pgp(`postgres://${postgresUser}:${postgresPW}@${dbHost}:5432/${postgresDB}`);

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
export {db, pgp};